// Server-only helper for talking to Groq.
// Never import this into a client component: it reads the API key.

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Model IDs go stale. Groq retired the Llama chat models in 2026, so anything
 * still pointing at llama-3.1-8b-instant or llama-3.3-70b-versatile returns a
 * 400 and every call fails.
 *
 * If this ever breaks again, the live list is at:
 *   https://api.groq.com/openai/v1/models
 * Paste a current id in below. Order matters, the first one is tried first.
 *
 * Free plan allowance is per model AND per organisation, so splitting the two
 * jobs across two models doubles the daily headroom. Keep them different.
 */

// Cheap and quick. Reads her moment and writes her questions.
export const FAST_MODELS = ["openai/gpt-oss-20b", "openai/gpt-oss-120b"];

// Better writing. Falls back when the day's allowance is spent.
export const WRITER_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"];

type Msg = { role: "system" | "user"; content: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function callGroq(
  messages: Msg[],
  opts: { models: string[]; maxTokens?: number; json?: boolean; temperature?: number }
): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set on this deployment");
  }

  const failures: string[] = [];

  // Two passes. The tokens-per-minute cap is the first thing that breaks when
  // several women arrive at once, and it clears in seconds, so one short wait
  // rescues most of those calls instead of showing an error.
  for (let pass = 0; pass < 2; pass++) {
    let sawRateLimit = false;

    for (const model of opts.models) {
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: opts.maxTokens ?? 900,
            temperature: opts.temperature ?? 0.8,
            ...(opts.json ? { response_format: { type: "json_object" } } : {}),
          }),
        });

        if (res.status === 429) {
          sawRateLimit = true;
          const detail = await res.text();
          failures.push(`${model} -> 429 ${detail.slice(0, 200)}`);
          continue;
        }

        if (!res.ok) {
          // Read the body so a dead model or a bad key says so out loud
          // instead of disappearing into a generic 500.
          const detail = await res.text();
          failures.push(`${model} -> ${res.status} ${detail.slice(0, 300)}`);
          continue;
        }

        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;

        if (typeof text === "string" && text.trim()) return text.trim();

        failures.push(`${model} -> empty response`);
      } catch (err) {
        failures.push(`${model} -> ${String(err)}`);
      }
    }

    // Only worth waiting if the failure was a rate limit. A dead model or a
    // bad key will fail exactly the same way a second time.
    if (!sawRateLimit) break;
    if (pass === 0) await sleep(4000);
  }

  // This lands in the Vercel function logs, which is where to look first.
  console.error("[groq] every model failed:\n" + failures.join("\n"));
  throw new Error(failures.join(" | ") || "All models failed");
}

// Models occasionally wrap JSON in prose or fences. Recover what we can.
export function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.search(/[[{]/);
    const end = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error("Could not parse model output as JSON");
  }
}