// Server-only helper for talking to Groq.
// Never import this into a client component: it reads the API key.

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Fast and cheap. Used for reading a moment and generating questions.
export const FAST_MODELS = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];

// Better writing. Falls back when the day's token allowance is spent.
export const WRITER_MODELS = ["llama-3.3-70b-versatile", "openai/gpt-oss-120b"];

type Msg = { role: "system" | "user"; content: string };

export async function callGroq(
  messages: Msg[],
  opts: { models: string[]; maxTokens?: number; json?: boolean; temperature?: number }
): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set");

  let lastError = "";

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

      if (res.status === 429 || res.status >= 500) {
        lastError = `${model} returned ${res.status}`;
        continue; // try the next model
      }

      if (!res.ok) {
        lastError = `${model} returned ${res.status}: ${await res.text()}`;
        continue;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (typeof text === "string" && text.trim()) return text.trim();

      lastError = `${model} returned an empty response`;
    } catch (err) {
      lastError = `${model} failed: ${String(err)}`;
    }
  }

  throw new Error(lastError || "All models failed");
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
