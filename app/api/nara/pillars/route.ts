import { NextResponse } from "next/server";
import { callGroq, parseJson, FAST_MODELS } from "@/lib/nara/groq";

export const runtime = "nodejs";
export const maxDuration = 30;

// Called once she has written a few posts. Nothing is asked of her up front.
export async function POST(request: Request) {
  try {
    const { what, posts, bank } = await request.json();

    const system = `You are a personal brand strategist reading everything a woman has written and captured over the last few weeks.

Name the four things she is building a reputation for. A pillar is a position she is taking in someone's mind, not a topic label. Use her own words and her own subject matter wherever you can.

Rules:
- Exactly four.
- Each name is at most eight words and reads like something she would say, not like a marketing category. "Building for people who do not trust digital money" is right. "Fintech thought leadership" is wrong.
- One short line each explaining who it is for and why it matters to her career.
- If her material clearly only supports three, invent a fourth from the gap you can see in what she does, and say plainly in its line that this is the one she is not yet writing about.
- Never flatter her.

Return JSON only: {"pillars":[{"name":"...","why":"..."}]}`;

    const user = `What she does: ${what || "not given"}

Posts she has published:
${(Array.isArray(posts) ? posts : []).slice(-8).map((p: string, i: number) => `${i + 1}. ${p}`).join("\n\n") || "(none yet)"}

Moments she captured but has not posted:
${(Array.isArray(bank) ? bank : []).slice(-12).map((m: string) => `- ${m}`).join("\n") || "(none)"}`;

    const { text: raw } = await callGroq(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { models: FAST_MODELS, maxTokens: 700, json: true, temperature: 0.7 }
    );

    const parsed = parseJson<{ pillars: { name: string; why: string }[] }>(raw);
    const pillars = (parsed.pillars || [])
      .filter((p) => p && p.name)
      .slice(0, 4)
      .map((p) => ({ name: String(p.name).trim(), why: String(p.why || "").trim() }));

    if (!pillars.length) {
      return NextResponse.json({ error: "Not enough to read yet." }, { status: 422 });
    }

    return NextResponse.json({ pillars });
  } catch (err) {
    console.error("[post-builder/pillars]", err);
    return NextResponse.json({ error: "Could not read your pillars right now." }, { status: 500 });
  }
}
