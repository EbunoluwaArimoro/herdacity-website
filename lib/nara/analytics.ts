// Server-only. Writes behaviour events to Supabase.
//
// Deliberately stores NO content. Never the moment she captured, never her
// answers, never the post. Only what happened, so we can see where the tool
// helps and where people give up.

type Props = Record<string, string | number | boolean | null>;

export async function track(event: string, props: Props = {}, session?: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Analytics must never be able to break the tool. If it is not configured,
  // or Supabase is down, the request carries on as though nothing happened.
  if (!url || !key) return;

  try {
    await fetch(`${url}/rest/v1/nara_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        event,
        session: session || null,
        props,
      }),
    });
  } catch (err) {
    console.error("[nara/analytics] failed to record", event, String(err));
  }
}

// Fire and forget. Use this inside route handlers so a slow insert never
// adds latency to her request.
export function trackAsync(event: string, props: Props = {}, session?: string) {
  void track(event, props, session);
}
