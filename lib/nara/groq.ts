// Server-only helper for talking to Groq.
// Never import this into a client component: it reads the API key.

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Model IDs go stale. Groq retired the Llama chat models in 2026.
 * The live list is at https://api.groq.com/openai/v1/models
 */

// Cheap and quick. Reads her moment and writes her questions.
export const FAST_MODELS = ["openai/gpt-oss-20b", "openai/gpt-oss-120b"];

// Better writing. Falls back when the day's allowance is spent.
export const WRITER_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"];

type Msg = { role: "system" | "user"; content: string };

export type GroqResult = { text: string; model: string; fellBack: boolean };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function callGroq(
  messages: Msg[],
  opts: { models: string[]; maxTokens?: number; json?: boolean; temperature?: number }
): Promise<GroqResult> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set on this deployment");
  }

  const failures: string[] = [];

  for (let pass = 0; pass < 2; pass++) {
    let sawRateLimit = false;

    for (let i = 0; i < opts.models.length; i++) {
      const model = opts.models[i];

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
            max_tokens: opts.maxTokens ?? 1400,
            temperature: opts.temperature ?? 0.7,
            // gpt-oss are reasoning models. Left to themselves they spend a
            // lot of the budget thinking and start formatting the answer like
            // a document. Low effort keeps them closer to the instruction.
            ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
            ...(opts.json ? { response_format: { type: "json_object" } } : {}),
          }),
        });

        if (res.status === 429) {
          sawRateLimit = true;
          failures.push(`${model} -> 429 ${(await res.text()).slice(0, 200)}`);
          continue;
        }

        if (!res.ok) {
          failures.push(`${model} -> ${res.status} ${(await res.text()).slice(0, 300)}`);
          continue;
        }

        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;

        if (typeof text === "string" && text.trim()) {
          return { text: text.trim(), model, fellBack: i > 0 || pass > 0 };
        }

        failures.push(`${model} -> empty response`);
      } catch (err) {
        failures.push(`${model} -> ${String(err)}`);
      }
    }

    if (!sawRateLimit) break;
    if (pass === 0) await sleep(4000);
  }

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
