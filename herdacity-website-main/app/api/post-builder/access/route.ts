import { NextResponse } from "next/server";

export const runtime = "nodejs";

// The email gate. She gives an address once, it is tagged in ConvertKit,
// and she is never asked again on that device.
export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "That email does not look right." }, { status: 400 });
    }

    const API_KEY = process.env.CONVERTKIT_API_KEY;
    const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;

    // Create a separate tag in ConvertKit for tool users and put its id here,
    // so this audience can be segmented from general community sign-ups.
    const TAG_ID = process.env.CONVERTKIT_TOOL_TAG_ID || "14338360";

    // If the mailing list is not configured, still let her in.
    // A broken integration should never block the tool.
    if (!API_KEY || !FORM_ID) {
      console.warn("[post-builder/access] ConvertKit not configured, allowing access anyway");
      return NextResponse.json({ ok: true, subscribed: false });
    }

    const res = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        api_key: API_KEY,
        email,
        first_name: firstName || undefined,
        tags: [TAG_ID],
      }),
    });

    if (!res.ok) {
      console.error("[post-builder/access] ConvertKit responded", res.status, await res.text());
      return NextResponse.json({ ok: true, subscribed: false });
    }

    return NextResponse.json({ ok: true, subscribed: true });
  } catch (err) {
    console.error("[post-builder/access]", err);
    return NextResponse.json({ ok: true, subscribed: false });
  }
}
