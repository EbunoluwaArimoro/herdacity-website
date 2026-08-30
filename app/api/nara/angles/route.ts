import { NextResponse } from "next/server";
import { callGroq, parseJson, FAST_MODELS } from "@/lib/nara/groq";
import { anglesForPrompt } from "@/lib/nara/angles";
import { trackAsync } from "@/lib/nara/analytics";
import { clamp, MAX_MOMENT } from "@/lib/nara/limit";

export const runtime = "nodejs";
export const maxDuration = 45;

type Option = { angleId: string; label: string; questions: string[] };

export async function POST(request: Request) {
  const started = Date.now();
  let session: string | undefined;

  try {
    const body = await request.json();
    session = typeof body.session === "string" ? body.session : undefined;

    const moment = clamp(body.moment, MAX_MOMENT);
    const what = clamp(body.what, 300);
    const isReaction = body.mode === "reaction";

    if (moment.length < 3) {
      return NextResponse.json({ error: "Tell me a little more first." }, { status: 400 });
    }

    trackAsync("angles_requested", { mode: isReaction ? "reaction" : "moment", momentLength: moment.length }, session);

    const system = `You help a professional woman turn something that happened to her into a LinkedIn post.

You do two jobs and nothing else.

JOB ONE. Read what she captured and choose the three or four angles from the list below that genuinely fit it. Never choose an angle the material cannot support. If there is no figure in what she wrote, do not choose the number angle. If nobody else appears in it, do not choose the person angle. If she did not get anything wrong, do not choose the mistake angle. Three good options beat four forced ones.

THE ANGLES
${anglesForPrompt()}

JOB TWO. For each angle you choose, write:
- a label of at most twelve words, phrased using her own material, describing the post she would be writing. Never use the angle's name. Never use marketing language. Write it the way a sharp friend would suggest it.
- three or four questions that ask ONLY for what is missing from what she gave you. Do not ask for anything she already told you. Ask for the specific things a reader would want and she left out: what she actually said, the figure, what changed afterwards, what she does differently now, who else was there. Each question must be short, plain and answerable in one line.

${isReaction ? "She is reacting to something she read or saw. Your questions must pull out what SHE has personally witnessed that supports or contradicts it. A post that only summarises someone else's point is worthless. At least two questions must be about her own direct experience." : ""}

Return JSON only, in exactly this shape:
{"options":[{"angleId":"scene","label":"...","questions":["...","...","..."]}]}`;

    const user = `What she does: ${what || "not given"}

What she captured:
${moment}`;

    const raw = await callGroq(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { models: FAST_MODELS, maxTokens: 900, json: true, temperature: 0.85 }
    );

    const parsed = parseJson<{ options: Option[] }>(raw);

    const options = (parsed.options || [])
      .filter((o) => o && o.label && Array.isArray(o.questions) && o.questions.length)
      .slice(0, 4)
      .map((o) => ({
        angleId: String(o.angleId || "scene"),
        label: String(o.label).trim(),
        questions: o.questions.map((q) => String(q).trim()).filter(Boolean).slice(0, 4),
      }));

    if (!options.length) {
      trackAsync("angles_empty", {}, session);
      return NextResponse.json(
        { error: "That did not give me enough to work with. Add a line more." },
        { status: 422 }
      );
    }

    // Which angles the model offers, so we can compare against which get picked.
    trackAsync(
      "angles_returned",
      { offered: options.map((o) => o.angleId).join(","), count: options.length, ms: Date.now() - started },
      session
    );

    return NextResponse.json({ options });
  } catch (err) {
    console.error("[nara/angles]", err);
    trackAsync("angles_failed", { reason: String(err).slice(0, 200) }, session);
    return NextResponse.json(
      { error: "Something went wrong on our side. Try again in a moment." },
      { status: 500 }
    );
  }
}
