// The twelve angles. She never sees this list.
// The model is given it, picks the three or four that genuinely fit
// what she captured, and phrases each one back in her own material.

export type Angle = {
  id: string;
  name: string;
  opens: string;
  fitsWhen: string;
};

export const ANGLES: Angle[] = [
  {
    id: "scene",
    name: "The scene",
    opens: "What actually happened, told as a moment with a turn in it",
    fitsWhen: "there is a specific event with a before and an after",
  },
  {
    id: "lesson",
    name: "The lesson",
    opens: "What she now knows because of it",
    fitsWhen: "the moment changed how she does something",
  },
  {
    id: "disagreement",
    name: "The disagreement",
    opens: "What most people believe, and why she does not",
    fitsWhen: "there is a common assumption her experience contradicts",
  },
  {
    id: "method",
    name: "The method",
    opens: "How she actually does the thing, concretely",
    fitsWhen: "the knowledge transfers to someone else's work",
  },
  {
    id: "mistake",
    name: "The mistake",
    opens: "What she got wrong before she got it right",
    fitsWhen: "the error is hers and it is safe to tell now",
  },
  {
    id: "number",
    name: "The number",
    opens: "The result, stated plainly, with the figure kept in",
    fitsWhen: "a figure, timescale or measurable change is present",
  },
  {
    id: "person",
    name: "The person",
    opens: "Credit to someone who earned it, named specifically",
    fitsWhen: "another person is in the moment and deserves the light",
  },
  {
    id: "recurring-question",
    name: "The question she keeps getting",
    opens: "Answered once, publicly, so she stops repeating herself",
    fitsWhen: "she has explained this to more than one person",
  },
  {
    id: "unwarned",
    name: "What nobody warned her about",
    opens: "The thing missing from the standard advice",
    fitsWhen: "the moment surprised her in a way it should not have",
  },
  {
    id: "comparison",
    name: "The comparison",
    opens: "This unfamiliar thing is like that familiar one",
    fitsWhen: "the work is hard to explain to people outside it",
  },
  {
    id: "receipt",
    name: "The receipt",
    opens: "Before set against after",
    fitsWhen: "something visibly changed over a period of time",
  },
  {
    id: "forecast",
    name: "Where this is going",
    opens: "Her read on what happens next in her field",
    fitsWhen: "the moment is a signal about something larger",
  },
];

export const anglesForPrompt = () =>
  ANGLES.map((a) => `${a.id} | ${a.name} | opens: ${a.opens} | fits when: ${a.fitsWhen}`).join("\n");

// Applied to every piece of writing the tool produces.
export const WRITING_RULES = `
HARD RULES. Breaking any of these makes the output unusable.

1. Use only facts, names, figures, dates and outcomes the writer supplied. Invent nothing.
   If a detail would strengthen the post and she did not give it, leave it out.
2. Never apologise, hedge, or ask permission. Remove "just", "only", "kind of", "I think maybe",
   "sorry for the long post", "I hope this is okay to share", "not sure if this is worth posting".
3. Never minimise her result and never hand her credit away. "A small win" is a win.
   If she says the team did everything, keep the team and keep her part in it too.
4. Never open with these or anything like them: "I am humbled to share", "Excited to announce",
   "Let that sink in", "Here's the thing", "Plot twist", "Unpopular opinion", "Let me tell you something".
5. Never end with a question written only to farm comments. If a closing line earns its place, keep it.
   Otherwise end on the last real thing she said.
6. No em dashes. No rule-of-three lists. No one-line-paragraph laddering for dramatic effect.
   No "It's not X. It's Y." constructions.
7. Write in her English. If her samples use Nigerian English, keep it. Never correct her idiom,
   her spelling convention or her rhythm towards American English.
8. Emoji only if her own samples use them, and then sparingly.
9. First person. Plain sentences. Vary sentence length the way her samples do.
10. Output the post text only. No title, no preamble, no notes, no hashtags unless she used them.
`.trim();

export function voiceBlock(samples: string[]): string {
  const clean = samples.map((s) => s.trim()).filter(Boolean);
  if (!clean.length) {
    return "She gave no writing samples. Write plainly and unfussily. Do not perform a personality she has not shown you.";
  }
  return `Here is how she writes. Match her sentence length, formality, rhythm, punctuation habits and use of emoji. Do not copy her content, only her voice.

${clean.map((s, i) => `SAMPLE ${i + 1}:\n${s}`).join("\n\n")}`;
}
