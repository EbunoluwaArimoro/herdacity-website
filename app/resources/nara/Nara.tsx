"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  DAILY_LIMIT,
  Moment,
  RECENCY_PROMPTS,
  Store,
  emptyStore,
  load,
  newId,
  save,
  shouldAskRecency,
  today,
} from "@/lib/nara/storage";

type Option = { angleId: string; label: string; questions: string[] };
type View = "gate" | "setup" | "home" | "compose" | "angles" | "questions" | "post";
type Mode = "moment" | "blank" | "reaction";

const LENGTHS = [
  { id: "short", label: "Short take", hint: "40 to 70 words" },
  { id: "standard", label: "Standard", hint: "120 to 180 words" },
  { id: "long", label: "The long one", hint: "250 to 350 words" },
];

const REFINEMENTS = [
  { id: "shorter", label: "Shorter" },
  { id: "warmer", label: "Warmer" },
  { id: "bolder", label: "Bolder" },
  { id: "plainer", label: "Plainer" },
];

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-brand-off-white">
    <div className="mx-auto w-full max-w-2xl px-5 pb-24 pt-28 sm:pt-32">{children}</div>
  </div>
);

const Err = ({ error }: { error: string }) =>
  error ? (
    <p className="mt-3 rounded-xl bg-brand-blush/60 px-4 py-3 text-sm text-brand-charcoal">
      {error}
    </p>
  ) : null;

const Back = ({
  to,
  setError,
  setView,
}: {
  to: View;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
}) => (
  <button
    onClick={() => {
      setError("");
      setView(to);
    }}
    className="mb-6 flex items-center gap-2 text-sm text-brand-charcoal/60 transition-colors hover:text-brand-pink"
  >
    <ArrowLeft size={16} /> Back
  </button>
);

export default function Nara() {
  const [session] = useState(() => Math.random().toString(36).slice(2, 12));
  const [mounted, setMounted] = useState(false);
  const [store, setStore] = useState<Store>(emptyStore());
  const [view, setView] = useState<View>("gate");

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [what, setWhat] = useState("");
  const [sample, setSample] = useState("");

  const [mode, setMode] = useState<Mode>("moment");
  const [draft, setDraft] = useState("");
  const [sourceMomentId, setSourceMomentId] = useState<string | null>(null);

  const [options, setOptions] = useState<Option[]>([]);
  const [chosen, setChosen] = useState<Option | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [length, setLength] = useState("standard");

  const [postText, setPostText] = useState("");
  const [copied, setCopied] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [capture, setCapture] = useState("");
  const [recencyAnswer, setRecencyAnswer] = useState("");
  const [pillarsBusy, setPillarsBusy] = useState(false);
  const [pillarDraft, setPillarDraft] = useState<
    { name: string; why: string }[] | null
  >(null);

  const track = useCallback((event: string, props: Record<string, unknown> = {}) => {
    void fetch("/api/nara/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, props, session }),
    }).catch(() => {});
  }, [session]);

  useEffect(() => {
    const s = load();
    setStore(s);
    setMounted(true);

    if (!s.email) setView("gate");
    else if (!s.profile.what) setView("setup");
    else setView("home");
  }, []);

  const persist = useCallback((next: Store) => {
    setStore(next);
    save(next);
  }, []);

  const unused = useMemo(
    () => store.bank.filter((m) => !m.used).reverse(),
    [store.bank]
  );

  const remaining =
    DAILY_LIMIT -
    (store.usage.date === today() ? store.usage.count : 0);

  const askRecency =
    mounted && view === "home" && shouldAskRecency(store);

  const recencyPrompt =
    RECENCY_PROMPTS[store.recencyIndex % RECENCY_PROMPTS.length];

  // ---------- actions ----------

  async function submitEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email does not look right.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await fetch("/api/nara/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });
    } catch {
      // Never block her on the mailing list.
    }

    const next = { ...store, email };

    persist(next);
    setBusy(false);
    setView("setup");
  }

  function finishSetup() {
    if (what.trim().length < 5) {
      setError("One line is enough, but I do need it.");
      return;
    }

    setError("");

    persist({
      ...store,
      profile: {
        ...store.profile,
        what: what.trim(),
        samples: sample.trim() ? [sample.trim()] : [],
      },
    });

    setView("home");
  }

  function addMoment(text: string, source: Moment["source"]) {
    if (!text.trim()) return;

    const moment: Moment = {
      id: newId(),
      text: text.trim(),
      at: Date.now(),
      used: false,
      source,
    };

    persist({
      ...store,
      bank: [...store.bank, moment],
    });
  }

  function answerRecency() {
    if (!recencyAnswer.trim()) return;

    persist({
      ...store,
      bank: [
        ...store.bank,
        {
          id: newId(),
          text: recencyAnswer.trim(),
          at: Date.now(),
          used: false,
          source: "recency",
        },
      ],
      lastRecencyPromptAt: Date.now(),
      recencyIndex: store.recencyIndex + 1,
    });

    setRecencyAnswer("");
  }

  function skipRecency() {
    persist({
      ...store,
      lastRecencyPromptAt: Date.now(),
      recencyIndex: store.recencyIndex + 1,
    });
  }

  function deleteMoment(id: string) {
    persist({
      ...store,
      bank: store.bank.filter((m) => m.id !== id),
    });
  }

  function openCompose(
    m: Mode,
    text = "",
    momentId: string | null = null
  ) {
    setMode(m);
    setDraft(text);
    setSourceMomentId(momentId);
    setOptions([]);
    setChosen(null);
    setAnswers([]);
    setPostText("");
    setError("");
    setView("compose");
  }

  async function findAngles() {
    if (draft.trim().length < 8) {
      setError("A line or two, then I can work with it.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/nara/angles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moment: draft,
          what: store.profile.what,
          mode: mode === "reaction" ? "reaction" : "moment",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not read that.");
      }

      setOptions(data.options);
      setView("angles");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }

    setBusy(false);
  }

  function chooseOption(o: Option) {
    setChosen(o);
    setAnswers(new Array(o.questions.length).fill(""));
    setError("");
    setView("questions");
  }

  async function writePost(tone?: string) {
    if (remaining <= 0 && !tone) {
      setError(
        "That is five posts today. Come back tomorrow, the bank will keep."
      );
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/nara/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moment: draft,
          angleLabel: chosen?.label,
          qa: (chosen?.questions || []).map((q, i) => ({
            q,
            a: answers[i] || "",
          })),
          length,
          samples: store.profile.samples,
          what: store.profile.what,
          tone,
          previous: tone ? postText : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not write that.");
      }

      setPostText(data.post);

      if (!tone) {
        persist({
          ...store,
          usage: {
            date: today(),
            count:
              (store.usage.date === today()
                ? store.usage.count
                : 0) + 1,
          },
        });
      }

      setView("post");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }

    setBusy(false);
  }

  async function copyPost() {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "Copying is blocked in this browser. Select the text and copy it by hand."
      );
    }
  }

  function donePosting() {
    const next: Store = {
      ...store,
      posts: [
        ...store.posts,
        {
          id: newId(),
          text: postText,
          angleId: chosen?.angleId || "",
          angleLabel: chosen?.label || "",
          at: Date.now(),
        },
      ],
      bank: store.bank.map((m) =>
        m.id === sourceMomentId ? { ...m, used: true } : m
      ),
    };

    persist(next);
    setView("home");
  }

  async function readPillars() {
    setPillarsBusy(true);
    setError("");

    try {
      const res = await fetch("/api/nara/pillars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          what: store.profile.what,
          posts: store.posts.map((p) => p.text),
          bank: store.bank.map((m) => m.text),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Not yet.");
      }

      setPillarDraft(data.pillars);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not read your pillars."
      );
    }

    setPillarsBusy(false);
  }

  // ---------- shared bits ----------

  const field =
    "w-full rounded-2xl border border-brand-charcoal/10 bg-white px-4 py-3 text-base text-brand-charcoal outline-none transition-colors placeholder:text-brand-charcoal/35 focus:border-brand-pink";

  const primary =
    "w-full rounded-full bg-brand-pink px-6 py-4 font-display text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40";

  if (!mounted) {
    return (
      <Shell>
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-pink" />
        </div>
      </Shell>
    );
  }

  // ---------- views ----------

  if (view === "gate") {
    return (
      <Shell>
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-pink">
          Nara by The HERdacity Network
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-charcoal sm:text-5xl">
          Your expertise deserves the spotlight.
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-brand-charcoal/70">
          Input your raw thoughts.
          <br />
          Nara asks the critical questions you might overlook, structuring
          your insights into high-impact posts written in your authentic
          voice.
        </p>

        <div className="mt-10 space-y-3">
          <input
            className={field}
            placeholder="Your name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className={field}
            type="email"
            inputMode="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className={primary}
            onClick={submitEmail}
            disabled={busy}
          >
            {busy ? "One moment" : "Access Nara"}
          </button>

          <Err error={error} />

          <p className="pt-2 text-center text-xs leading-relaxed text-brand-charcoal/50">
            Everything you write in here stays on your own device and
            never reaches us.
          </p>
        </div>
      </Shell>
    );
  }

  if (view === "setup") {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-bold text-brand-charcoal">
          Two questions, then you are in.
        </h1>

        <p className="mt-3 text-brand-charcoal/70">
          This takes about a minute. Everything else it learns from what
          you write.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="font-display text-sm font-semibold text-brand-charcoal">
              What do you do, and who for?
            </label>

            <p className="mb-2 mt-1 text-sm text-brand-charcoal/55">
              One line, the way you would say it to someone at a party.
            </p>

            <input
              className={field}
              placeholder="I build payment products for small businesses in Nigeria"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
            />
          </div>

          <div>
            <label className="font-display text-sm font-semibold text-brand-charcoal">
              Paste something you have written before.
            </label>

            <p className="mb-2 mt-1 text-sm text-brand-charcoal/55">
              Any old post, or part of an email. This is how it learns to
              sound like you rather than like a chatbot. Skip it if you
              would rather.
            </p>

            <textarea
              className={`${field} min-h-[140px] resize-y`}
              placeholder="Paste here"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
            />
          </div>

          <button className={primary} onClick={finishSetup}>
            Start
          </button>

          <Err error={error} />
        </div>
      </Shell>
    );
  }

  if (view === "home") {
    return (
      <Shell>
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-bold text-brand-charcoal">
            {store.posts.length
              ? "What is on your mind?"
              : "Let us start with what happened."}
          </h1>
        </div>

        {askRecency && (
          <div className="mt-7 rounded-3xl border border-brand-pink/25 bg-brand-blush/35 p-5">
            <p className="font-display text-base font-semibold text-brand-charcoal">
              {recencyPrompt}
            </p>

            <p className="mt-1 text-sm text-brand-charcoal/60">
              One line. It saves to your bank so there is always something
              here when you need it.
            </p>

            <textarea
              className={`${field} mt-3 min-h-[80px] resize-y`}
              placeholder="Type it however it comes out"
              value={recencyAnswer}
              onChange={(e) => setRecencyAnswer(e.target.value)}
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={answerRecency}
                className="rounded-full bg-brand-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Save it
              </button>

              <button
                onClick={skipRecency}
                className="rounded-full px-4 py-2.5 text-sm text-brand-charcoal/55 hover:text-brand-charcoal"
              >
                Not now
              </button>
            </div>
          </div>
        )}

        <div className="mt-7 rounded-3xl bg-white p-5 shadow-sm">
          <label className="font-display text-sm font-semibold text-brand-charcoal">
            What happened?
          </label>

          <p className="mb-3 mt-1 text-sm text-brand-charcoal/55">
            Anything at all. Ten seconds now saves you a blank page later.
          </p>

          <textarea
            className={`${field} min-h-[80px] resize-y`}
            placeholder="A meeting, a number, something that annoyed you"
            value={capture}
            onChange={(e) => setCapture(e.target.value)}
          />

          <button
            onClick={() => {
              addMoment(capture, "capture");
              setCapture("");
            }}
            disabled={!capture.trim()}
            className="mt-3 flex items-center gap-2 rounded-full bg-brand-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            <Plus size={15} /> Save to my bank
          </button>
        </div>

        <div className="mt-8 grid gap-3">
          <DoorButton
            title="Something happened"
            sub="You know what you want to say"
            onClick={() => openCompose("moment")}
          />

          <DoorButton
            title="I have nothing today"
            sub={
              unused.length
                ? `${unused.length} thing${
                    unused.length === 1 ? "" : "s"
                  } waiting in your bank`
                : "Save a moment above and this fills up"
            }
            onClick={() => openCompose("blank")}
          />

          <DoorButton
            title="React to this"
            sub="Paste something you read and give it your take"
            onClick={() => openCompose("reaction")}
          />
        </div>

        {unused.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-brand-charcoal/45">
              Your bank
            </h2>

            <div className="mt-3 space-y-2">
              {unused.slice(0, 8).map((m) => (
                <div
                  key={m.id}
                  className="group flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
                >
                  <button
                    onClick={() =>
                      openCompose("moment", m.text, m.id)
                    }
                    className="flex-1 text-left text-sm leading-relaxed text-brand-charcoal/80"
                  >
                    {m.text}
                  </button>

                  <button
                    onClick={() => deleteMoment(m.id)}
                    aria-label="Delete"
                    className="mt-0.5 text-brand-charcoal/20 transition-colors hover:text-brand-pink"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {store.posts.length >= 3 &&
          !store.profile.pillars &&
          !pillarDraft && (
            <button
              onClick={readPillars}
              disabled={pillarsBusy}
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-3xl border border-brand-pink/30 bg-white px-5 py-5 text-left font-display text-base font-semibold text-brand-charcoal transition-colors hover:border-brand-pink"
            >
              {pillarsBusy ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Sparkles size={18} className="text-brand-pink" />
              )}

              {pillarsBusy
                ? "Reading what you have written"
                : "See what you are actually building"}
            </button>
          )}

        {pillarDraft && (
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-brand-charcoal">
              Four things you are becoming known for
            </h2>

            <p className="mt-2 text-sm text-brand-charcoal/60">
              Read from your own posts, not from a template. Change
              anything that is wrong.
            </p>

            <div className="mt-5 space-y-4">
              {pillarDraft.map((p, i) => (
                <div key={i}>
                  <input
                    className={`${field} font-display font-semibold`}
                    value={p.name}
                    onChange={(e) => {
                      const next = [...pillarDraft];
                      next[i] = {
                        ...next[i],
                        name: e.target.value,
                      };
                      setPillarDraft(next);
                    }}
                  />

                  <p className="mt-1.5 px-1 text-sm text-brand-charcoal/55">
                    {p.why}
                  </p>
                </div>
              ))}
            </div>

            <button
              className={`${primary} mt-6`}
              onClick={() => {
                persist({
                  ...store,
                  profile: {
                    ...store.profile,
                    pillars: pillarDraft.map((p) => p.name),
                  },
                });

                setPillarDraft(null);
              }}
            >
              These are mine
            </button>
          </div>
        )}

        {store.profile.pillars && (
          <div className="mt-10">
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-brand-charcoal/45">
              What you are building
            </h2>

            <ul className="mt-3 space-y-2">
              {store.profile.pillars.map((p, i) => (
                <li
                  key={i}
                  className="rounded-2xl bg-white px-4 py-3 text-sm text-brand-charcoal/80 shadow-sm"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Err error={error} />
      </Shell>
    );
  }

  if (view === "compose") {
    return (
      <Shell>
        <Back
          to="home"
          setError={setError}
          setView={setView}
        />

        <h1 className="font-display text-2xl font-bold text-brand-charcoal">
          {mode === "reaction"
            ? "What did you read?"
            : mode === "blank"
            ? "Pick something from your bank"
            : "Tell me what happened"}
        </h1>

        {mode === "blank" && (
          <div className="mt-5 space-y-2">
            {unused.length === 0 && (
              <p className="rounded-2xl bg-white px-4 py-4 text-sm text-brand-charcoal/60 shadow-sm">
                Your bank is empty. Go back and answer the question on
                the home screen, or just type something below.
              </p>
            )}

            {unused.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setDraft(m.text);
                  setSourceMomentId(m.id);
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${
                  draft === m.text
                    ? "border-brand-pink bg-brand-blush/40 text-brand-charcoal"
                    : "border-transparent bg-white text-brand-charcoal/80 shadow-sm hover:border-brand-pink/40"
                }`}
              >
                {m.text}
              </button>
            ))}
          </div>
        )}

        <p className="mb-2 mt-6 text-sm text-brand-charcoal/55">
          {mode === "reaction"
            ? "Paste the headline, the post, or the part that got your attention."
            : "Messy is fine. Fragments are fine. Nobody sees this but you."}
        </p>

        <textarea
          className={`${field} min-h-[160px] resize-y`}
          placeholder={
            mode === "reaction"
              ? "Paste it here, then add a line on why it stuck with you"
              : "Three hours debugging something that turned out to be a timezone issue. Again."
          }
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />

        <button
          className={`${primary} mt-5`}
          onClick={findAngles}
          disabled={busy}
        >
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Reading it
            </span>
          ) : (
            "Show me what this could be"
          )}
        </button>

        <Err error={error} />
      </Shell>
    );
  }

  if (view === "angles") {
    return (
      <Shell>
        <Back
          to="compose"
          setError={setError}
          setView={setView}
        />

        <h1 className="font-display text-2xl font-bold text-brand-charcoal">
          There are a few posts in this.
        </h1>

        <p className="mt-2 text-brand-charcoal/65">
          Pick the one you actually want to write.
        </p>

        <div className="mt-7 space-y-3">
          {options.map((o, i) => (
            <button
              key={i}
              onClick={() => chooseOption(o)}
              className="w-full rounded-3xl bg-white px-5 py-5 text-left shadow-sm transition-all hover:shadow-md"
            >
              <p className="font-display text-lg font-semibold leading-snug text-brand-charcoal">
                {o.label}
              </p>

              <p className="mt-1.5 text-sm text-brand-charcoal/50">
                {o.questions.length} quick questions
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={findAngles}
          disabled={busy}
          className="mt-6 flex items-center gap-2 text-sm text-brand-charcoal/55 hover:text-brand-pink"
        >
          <RefreshCw size={14} /> Show me different ones
        </button>

        <Err error={error} />
      </Shell>
    );
  }

  if (view === "questions") {
    return (
      <Shell>
        <Back
          to="angles"
          setError={setError}
          setView={setView}
        />

        <h1 className="font-display text-2xl font-bold leading-snug text-brand-charcoal">
          {chosen?.label}
        </h1>

        <p className="mt-2 text-brand-charcoal/65">
          Only what is missing. One line each is plenty, and you can
          skip any of them.
        </p>

        <div className="mt-7 space-y-5">
          {chosen?.questions.map((q, i) => (
            <div key={i}>
              <label className="font-display text-sm font-semibold text-brand-charcoal">
                {q}
              </label>

              <textarea
                className={`${field} mt-2 min-h-[70px] resize-y`}
                value={answers[i] || ""}
                onChange={(e) => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="font-display text-sm font-semibold text-brand-charcoal">
            How long?
          </p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {LENGTHS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLength(l.id)}
                className={`rounded-2xl px-3 py-3 text-left transition-colors ${
                  length === l.id
                    ? "bg-brand-pink text-white"
                    : "bg-white text-brand-charcoal shadow-sm"
                }`}
              >
                <span className="block font-display text-sm font-semibold">
                  {l.label}
                </span>

                <span
                  className={`block text-xs ${
                    length === l.id
                      ? "text-white/75"
                      : "text-brand-charcoal/45"
                  }`}
                >
                  {l.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          className={`${primary} mt-7`}
          onClick={() => writePost()}
          disabled={busy}
        >
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Writing
            </span>
          ) : (
            "Write my post"
          )}
        </button>

        <p className="mt-3 text-center text-xs text-brand-charcoal/45">
          {remaining} left today
        </p>

        <Err error={error} />
      </Shell>
    );
  }

  // view === "post"
  return (
    <Shell>
      <Back
        to="questions"
        setError={setError}
        setView={setView}
      />

      <h1 className="font-display text-2xl font-bold text-brand-charcoal">
        Here it is.
      </h1>

      <p className="mt-2 text-brand-charcoal/65">
        Every fact in this came from you. Edit it freely, it is yours.
      </p>

      <textarea
        className={`${field} mt-6 min-h-[340px] resize-y leading-relaxed`}
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {REFINEMENTS.map((r) => (
          <button
            key={r.id}
            onClick={() => writePost(r.id)}
            disabled={busy}
            className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-charcoal shadow-sm transition-colors hover:text-brand-pink disabled:opacity-40"
          >
            {r.label}
          </button>
        ))}
      </div>

      <button
        className={`${primary} mt-6 flex items-center justify-center gap-2`}
        onClick={copyPost}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? "Copied" : "Copy the post"}
      </button>

      <button
        onClick={donePosting}
        className="mt-3 w-full rounded-full px-6 py-3 text-sm font-semibold text-brand-charcoal/60 transition-colors hover:text-brand-pink"
      >
        Done, take me back
      </button>

      <Err error={error} />
    </Shell>
  );
}

const DoorButton = ({
  title,
  sub,
  onClick,
}: {
  title: string;
  sub: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-3xl bg-white px-5 py-5 text-left shadow-sm transition-all hover:shadow-md"
    >
      <span className="block font-display text-lg font-semibold text-brand-charcoal">
        {title}
      </span>

      <span className="mt-0.5 block text-sm text-brand-charcoal/55">
        {sub}
      </span>
    </button>
  );
};