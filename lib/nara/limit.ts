// Server-side daily cap.
//
// The old limit lived in localStorage, which meant it was enforced by the
// browser of the person being limited. Incognito reset it. This holds the
// count in a signed cookie instead, so the value cannot be edited by hand.
//
// Clearing cookies still resets it. That is deliberate for now: it is enough
// friction to stop casual over-use, and the proper fix arrives with accounts.

import { createHmac, timingSafeEqual } from "crypto";

export const DAILY_POST_LIMIT = 5;
export const MAX_REFINEMENTS = 3;
export const COOKIE_NAME = "nara_use";

// Longest text we will send to the model, in characters.
// Her voice sample rides along on every single write call, so an unbounded
// one quietly doubles the cost of every post she ever writes.
export const MAX_SAMPLE = 900;
export const MAX_MOMENT = 1500;
export const MAX_ANSWER = 400;

export function clamp(text: unknown, max: number): string {
  if (typeof text !== "string") return "";
  const t = text.trim();
  return t.length <= max ? t : t.slice(0, max);
}

function secret(): string {
  return process.env.NARA_SECRET || process.env.GROQ_API_KEY || "nara-fallback";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex").slice(0, 24);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Reads today's count from the cookie header. Tampered or stale values read as zero. */
export function readCount(cookieHeader: string | null): number {
  if (!cookieHeader) return 0;

  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return 0;

  const [date, countRaw, sig] = decodeURIComponent(match[1]).split(".");
  if (!date || !countRaw || !sig) return 0;

  const expected = sign(`${date}.${countRaw}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return 0;

  if (date !== today()) return 0; // yesterday's count does not carry over

  const count = Number(countRaw);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

/** Builds the cookie value for the next request. */
export function buildCookie(count: number): string {
  const payload = `${today()}.${count}`;
  return `${payload}.${sign(payload)}`;
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 36,
};
