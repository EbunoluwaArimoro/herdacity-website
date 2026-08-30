import { NextResponse } from "next/server";
import { track } from "@/lib/nara/analytics";

export const runtime = "nodejs";

// Events the server cannot see for itself: which screen she reached,
// which angle she chose, and whether she actually copied the post.
// Nothing she wrote is accepted here, only the name of what happened.
const ALLOWED = new Set([
  "gate_viewed",
  "email_submitted",
  "setup_completed",
  "moment_captured",
  "recency_answered",
  "recency_skipped",
  "door_opened",
  "angle_chosen",
  "post_copied",
  "post_saved",
  "pillars_generated",
  "pillars_accepted",
]);

export async function POST(request: Request) {
  try {
    const { event, props, session } = await request.json();

    if (typeof event !== "string" || !ALLOWED.has(event)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Only short scalar values survive. This is the guard that stops any of
    // her writing reaching us by accident through a stray prop.
    const safe: Record<string, string | number | boolean | null> = {};

    if (props && typeof props === "object") {
      for (const [k, v] of Object.entries(props).slice(0, 8)) {
        if (typeof v === "number" || typeof v === "boolean") safe[k] = v;
        else if (typeof v === "string") safe[k] = v.slice(0, 60);
      }
    }

    await track(event, safe, typeof session === "string" ? session : undefined);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
