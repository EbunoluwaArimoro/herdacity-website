import { NextResponse } from "next/server";
import { callGroq, WRITER_MODELS } from "@/lib/nara/groq";
import { WRITING_RULES, voiceBlock } from "@/lib/nara/angles";
import { trackAsync } from "@/lib/nara/analytics";
import {
  buildCookie,
  clamp,
  COOKIE_NAME,
  COOKIE_OPTIONS,
  DAILY_POST_LIMIT,
  MAX_ANSWER,
  MAX_MOMENT,
  MAX_SAMPLE,
  readCount,
} from "@/lib/nara/limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const LENGTHS: Record<string, { rule: string; cap: number; budget: number }> = {
  short: {
    rule: "Between 40 and 70 words. One observation or one plain statement of the result. No build-up, no scene setting.",
    cap: 70,
    budget: 700,
  },
  standard: {
    rule: "Between 120 and 180 words. A scene, a turn, and what it means now.",
    cap: 180,
    budget: 1100,
  },
  long: {
    rule: "Between 250 and 350 words. Room to teach properly or tell the whole story.",
    cap: 350,
    budget: 1800,
  },
};

const TONES: Record<string, string> = {
  shorter: "Cut it by roughly a third. Keep every concrete detail and delete everything else.",
  warmer: "Warmer and more human. Same facts, less distance from the reader.",
  bolder: "More direct. State her position without softening it. Do not add claims she did not make.",
  plainer: "Less formal. Shorter words. The way she would say it out loud to a colleague.",
};

/**
 * Reasoning models like to dress the answer up as a document. This removes the
 * furniture they add at the top and bottom: headings, dates, "Post:" labels,
 * horizontal rules and word counts. Deterministic, so it works even when the
 * model ignores the instruction.
 */
function stripFurniture(raw: string): string {
  let text = raw.replace(/^\s*```[a-z]*\s*|\s*```\s*$/gi, "").trim();

  const furniture = [
    /^#{1,6}\s+.*$/,                                   // markdown heading
    /^(title|post|draft|subject|headline|date)\s*:/i,  // labelled line
    /^\*\*(title|post|draft|date)\b.*$/i,
    /^-{3,}$|^_{3,}$|^\*{3,}$/,                        // horizontal rule
    /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/,                 // 30/08/2026
    /^[A-Z][a-z]+ \d{1,2},? \d{4}$/,                   // August 30, 2026
    /^\d{1,2} [A-Z][a-z]+ \d{4}$/,                     // 30 August 2026
    /^word count\s*:/i,
    /^\(?\d+\s+words\)?$/i,
  ];

  const lines = text.split("\n");

  // Peel furniture off the top until a real line appears.
  while (lines.length) {
    const line = lines[0].trim();
    if (line === "" || furniture.some((re) => re.test(line))) {
      lines.shift();
    } else {
      break;
    }
  }

  // And off the bottom.
  while (lines.length) {
    const line = lines[lines.length - 1].trim();
    if (line === "" || furniture.some((re) => re.test(line))) {
      lines.pop();
    } else {
      break;
    }
  }

  text = lines.join("\n").trim();

  return text
    .replace(/^["']|["']$/g, "")
    .replace(/\u2014/g, ", ")
    .trim();
}

export async function POST(request: Request) {
  const started = Date.now();
  let session: string | undefined;

  try {
    const body = await request.json();
    session = typeof body.session === "string" ? body.session : undefined;

    const tone = typeof body.tone === "string" ? body.tone : undefined;
    const isRefinement = Boolean(tone && body.previous);

    const used = readCount(request.headers.get("cookie"));

    if (!isRefinement && used >= DAILY_POST_LIMIT) {
      trackAsync("limit_reached", { used }, session);
      return NextResponse.json(
        { error: "That is five posts today. Come back tomorrow, your bank will keep." },
        { status: 429 }
      );
    }

    const moment = clamp(body.moment, MAX_MOMENT);
    const what = clamp(body.what, 300);
    const angleLabel = clamp(body.angleLabel, 200);
    const angleId = clamp(body.angleId, 40);

    const samples = (Array.isArray(body.samples) ? body.samples : [])
      .slice(0, 2)
      .map((s: unknown) => clamp(s, MAX_SAMPLE))
      .filter(Boolean);

    const qa = (Array.isArray(body.qa) ? body.qa : [])
      .map((p: { q?: unknown; a?: unknown }) => ({
        q: clamp(p?.q, 200),
        a: clamp(p?.a, MAX_ANSWER),
      }))
      .filter((p: { q: string; a: string }) => p.a);

    if (!moment) {
      return NextResponse.json({ error: "Missing the material for the post." }, { status: 400 });
    }

    const thin = qa.length === 0 || qa.every((p: { a: string }) => p.a.split(/\s+/).length < 3);

    if (thin && !isRefinement) {
      trackAsync("write_too_thin", {}, session);
      return NextResponse.json(
        { error: "I need a bit more in at least one answer. One full sentence is enough." },
        { status: 422 }
      );
    }

    const lengthKey = (body.length as string) in LENGTHS ? (body.length as string) : "standard";
    const spec = LENGTHS[lengthKey];

    const system = `You write LinkedIn posts for a professional woman, using only material she has given you.

${voiceBlock(samples)}

${WRITING_RULES}

LENGTH FOR THIS POST: ${spec.rule}
Do not exceed ${spec.cap} words under any circumstances.

The post must be built out of her specifics. Her scene, her figures, her words, her judgement. If you find yourself writing a sentence that could appear in anyone's post about anything, delete it.`;

    const material = `What she does: ${what || "not given"}

The post she is writing: ${angleLabel || "her own account of what happened"}

What she captured:
${moment}

Her answers:
${qa.map((p: { q: string; a: string }) => `Q: ${p.q}\nA: ${p.a}`).join("\n\n") || "(she skipped the questions)"}`;

    // The closing instruction is repeated here on purpose. These models weight
    // the end of the conversation heavily, and this is where length and format
    // were being lost.
    const user = isRefinement
      ? `${material}

Here is the current draft:

${clamp(body.previous, 3000)}

REWRITE IT. ${TONES[tone as string] || ""}
Keep every fact exactly as it is. Stay under ${spec.cap} words.
Reply with the rewritten post only. No title, no date, no notes.`
      : `${material}

Write the post now.
Hard limit: ${spec.cap} words.
Reply with the post only. No title, no date, no heading, no notes.`;

    const { text, model, fellBack } = await callGroq(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { models: WRITER_MODELS, maxTokens: spec.budget, temperature: 0.7 }
    );

    const cleaned = stripFurniture(text);
    const words = cleaned.split(/\s+/).filter(Boolean).length;

    const nextCount = isRefinement ? used : used + 1;

    trackAsync(
      isRefinement ? "refinement_used" : "post_written",
      {
        angleId: angleId || null,
        length: lengthKey,
        tone: tone || null,
        answered: qa.length,
        hasVoiceSample: samples.length > 0,
        words,
        overLimit: words > spec.cap,
        model,
        fellBack,
        ms: Date.now() - started,
        postsToday: nextCount,
      },
      session
    );

    const res = NextResponse.json({
      post: cleaned,
      remaining: Math.max(0, DAILY_POST_LIMIT - nextCount),
    });

    res.cookies.set(COOKIE_NAME, buildCookie(nextCount), COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error("[nara/write]", err);
    trackAsync("write_failed", { reason: String(err).slice(0, 200) }, session);
    return NextResponse.json(
      { error: "The writer is busy. Give it a minute and try again." },
      { status: 500 }
    );
  }
}
