import { NextResponse } from "next/server";
import { callGroq, WRITER_MODELS } from "@/lib/postBuilder/groq";
import { WRITING_RULES, voiceBlock } from "@/lib/postBuilder/angles";

export const runtime = "nodejs";
export const maxDuration = 45;

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
  try {
    const body = await request.json();
    const { moment, angleLabel, qa, length, samples, what, tone, previous } = body;

    if (!moment || !Array.isArray(qa)) {
      return NextResponse.json({ error: "Missing the material for the post." }, { status: 400 });
    }

    const answered = (qa as { q: string; a: string }[]).filter((p) => p.a && p.a.trim());

    const thin = answered.length === 0 || answered.every((p) => p.a.trim().split(/\s+/).length < 3);
    if (thin && !tone) {
      return NextResponse.json(
        { error: "I need a bit more in at least one answer. One full sentence is enough." },
        { status: 422 }
      );
    }

    const lengthRule = LENGTHS[length as string] || LENGTHS.standard;

    const system = `You write LinkedIn posts for a professional woman, using only material she has given you.

${voiceBlock(Array.isArray(samples) ? samples : [])}

${WRITING_RULES}

LENGTH: ${lengthRule}

The post must be built out of her specifics. Her scene, her figures, her words, her judgement. If you find yourself writing a sentence that could appear in anyone's post about anything, delete it.`;

    const material = `What she does: ${what || "not given"}

The post she is writing: ${angleLabel || "her own account of what happened"}

What she captured:
${String(moment).trim()}

Her answers:
${answered.map((p) => `Q: ${p.q}\nA: ${p.a.trim()}`).join("\n\n") || "(she skipped the questions)"}`;

    const user = tone && previous
      ? `${material}\n\nHere is the current draft:\n\n${previous}\n\nRewrite it. ${TONES[tone as string] || ""} Keep every fact exactly as it is.`
      : `${material}\n\nWrite the post.`;

    const post = await callGroq(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { models: WRITER_MODELS, maxTokens: 900, temperature: 0.9 }
    );

    const cleaned = post
      .replace(/^["']|["']$/g, "")
      .replace(/\u2014/g, ", ")
      .trim();

    return NextResponse.json({ post: cleaned });
  } catch (err) {
    console.error("[post-builder/write]", err);
    return NextResponse.json(
      { error: "The writer is busy. Give it a minute and try again." },
      { status: 500 }
    );
  }
}
