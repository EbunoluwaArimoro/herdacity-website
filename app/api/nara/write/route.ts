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

const LENGTHS: Record<string, string> = {
  short: "40 to 70 words. One observation or one plain statement of the result. No build-up.",
  standard: "120 to 180 words. A scene, a turn, and what it means now.",
  long: "250 to 350 words. Room to teach or to tell the whole story properly.",
};

const TONES: Record<string, string> = {
  shorter: "Cut it by roughly a third. Keep every concrete detail and remove everything else.",
  warmer: "Warmer and more human. Same facts, less distance from the reader.",
  bolder: "More direct. State her position without softening it. Do not add claims she did not make.",
  plainer: "Less formal. Shorter words. The way she would say it out loud to a colleague.",
};

export async function POST(request: Request) {
  const started = Date.now();
  let session: string | undefined;

  try {
    const body = await request.json();
    session = typeof body.session === "string" ? body.session : undefined;

    const tone = typeof body.tone === "string" ? body.tone : undefined;
    const isRefinement = Boolean(tone && body.previous);

    // The cap counts finished posts, not refinements. Refinements are capped
    // separately on the client so a woman can still polish what she has.
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

    const lengthRule = LENGTHS[body.length as string] || LENGTHS.standard;

    const system = `You write LinkedIn posts for a professional woman, using only material she has given you.

${voiceBlock(samples)}

${WRITING_RULES}

LENGTH: ${lengthRule}

The post must be built out of her specifics. Her scene, her figures, her words, her judgement. If you find yourself writing a sentence that could appear in anyone's post about anything, delete it.`;

    const material = `What she does: ${what || "not given"}

The post she is writing: ${angleLabel || "her own account of what happened"}

What she captured:
${moment}

Her answers:
${qa.map((p: { q: string; a: string }) => `Q: ${p.q}\nA: ${p.a}`).join("\n\n") || "(she skipped the questions)"}`;

    const user = isRefinement
      ? `${material}\n\nHere is the current draft:\n\n${clamp(body.previous, 3000)}\n\nRewrite it. ${
          TONES[tone as string] || ""
        } Keep every fact exactly as it is.`
      : `${material}\n\nWrite the post.`;

    const post = await callGroq(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { models: WRITER_MODELS, maxTokens: 900, temperature: 0.9 }
    );

    const cleaned = post.replace(/^["']|["']$/g, "").replace(/\u2014/g, ", ").trim();

    const nextCount = isRefinement ? used : used + 1;

    trackAsync(
      isRefinement ? "refinement_used" : "post_written",
      {
        angleId: angleId || null,
        length: (body.length as string) || "standard",
        tone: tone || null,
        answered: qa.length,
        hasVoiceSample: samples.length > 0,
        words: cleaned.split(/\s+/).length,
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
