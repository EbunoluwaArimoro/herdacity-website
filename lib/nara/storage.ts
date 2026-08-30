// Everything she types lives on her own device. There is no database
// and nothing here is ever sent to HERdacity.

export type Moment = {
  id: string;
  text: string;
  at: number;
  used: boolean;
  source: "capture" | "recency" | "reaction";
};

export type SavedPost = {
  id: string;
  text: string;
  angleId: string;
  angleLabel: string;
  at: number;
};

export type Profile = {
  what: string; // what she does and who for
  samples: string[];
  pillars: string[] | null;
  pillarsDismissed: boolean;
};

export type Store = {
  v: 1;
  email: string | null;
  profile: Profile;
  bank: Moment[];
  posts: SavedPost[];
  usage: { date: string; count: number };
  lastRecencyPromptAt: number;
  recencyIndex: number;
};

const KEY = "herdacity_post_builder_v1";
export const DAILY_LIMIT = 5;

export const emptyStore = (): Store => ({
  v: 1,
  email: null,
  profile: { what: "", samples: [], pillars: null, pillarsDismissed: false },
  bank: [],
  posts: [],
  usage: { date: today(), count: 0 },
  lastRecencyPromptAt: 0,
  recencyIndex: 0,
});

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function load(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Store;
    if (parsed.v !== 1) return emptyStore();
    if (parsed.usage.date !== today()) parsed.usage = { date: today(), count: 0 };
    return { ...emptyStore(), ...parsed };
  } catch {
    return emptyStore();
  }
}

export function save(store: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Storage full or blocked. The session still works, it just will not persist.
  }
}

export const newId = () => Math.random().toString(36).slice(2, 10);

// Rotating questions about the recent past. This replaces any curated
// trend list: she supplies the context, and it compounds into her bank.
export const RECENCY_PROMPTS = [
  "What has taken up most of your week?",
  "Has anything at work irritated you lately?",
  "Has anyone asked you for help recently? What did they need?",
  "Read or heard anything you disagreed with?",
  "What went better than you expected this month?",
  "What is the last thing you had to explain twice?",
  "Has anything shifted in your industry that people are talking about?",
  "What did you finish recently that nobody knows about?",
  "Who did something for you lately that deserves saying out loud?",
  "What are you currently stuck on?",
  "What is the last decision you changed your mind about?",
  "What surprised you about your own work this week?",
];

export function shouldAskRecency(store: Store): boolean {
  const threeDays = 1000 * 60 * 60 * 24 * 3;
  const now = Date.now();
  if (now - store.lastRecencyPromptAt < threeDays) return false;
  const unused = store.bank.filter((m) => !m.used);
  return unused.length < 4;
}
