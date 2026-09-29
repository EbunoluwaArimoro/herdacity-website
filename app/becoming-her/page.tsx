import Image from "next/image";

const REGISTER_URL = "https://luma.com/ikndpol6";

export const metadata = {
  title: "Becoming HER 2026 | HERdacity",
  description:
    "Our annual gathering. A day of reflection, honest conversation, connection and intention for a hundred women. Saturday 5 December 2026, Café One, Oregun, Ikeja, Lagos.",
  openGraph: {
    title: "Becoming HER 2026 | HERdacity",
    description:
      "Where a hundred women decide what the next year looks like. Saturday 5 December 2026, Lagos.",
    images: ["https://www.herdacity.com/HER%20pic%20home.jpg"],
  },
};

const details = [
  { label: "Date", value: "Saturday 5 December 2026" },
  { label: "Time", value: "10:00 to 16:00, doors open at 09:30" },
  { label: "Venue", value: "Café One, Oregun, Ikeja, Lagos" },
  { label: "Ticket", value: "₦25,000, one hundred seats only" },
];

const dayHolds = [
  {
    title: "Reflection",
    text: "Honest stock of the year behind you, with space to think rather than rush.",
  },
  {
    title: "Conversation",
    text: "Sessions with women further ahead, close enough for real questions and real answers.",
  },
  {
    title: "Connection",
    text: "Shared tables and small groups, so you leave knowing people rather than just meeting them.",
  },
  {
    title: "Intention",
    text: "A guided session to set down what you want from the year ahead, in your own words.",
  },
];

const steps = [
  {
    title: "Register on Luma",
    text: "It takes less than a minute, and your seat is reserved as soon as you do.",
  },
  {
    title: "Make your transfer",
    text: "The payment details are in your registration email. Add the name you registered with to the transfer description so we can match it.",
  },
  {
    title: "Receive your ticket",
    text: "Once your payment reaches us, we confirm your seat and send your ticket and a calendar invite.",
  },
];

const gallery = [
  { src: "/events-hero.png", alt: "A session in the room at Becoming HER 2025" },
  { src: "/gallery-2.jpg", alt: "Lolita Ejiofor and Onyeka Koldsweat Akpaida at Becoming HER 2025" },
  { src: "/gallery-1.jpg", alt: "Members at Becoming HER 2025" },
];

export default function BecomingHerPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <Image
          src="/HER pic home.jpg"
          alt="The women of Becoming HER 2025 outside Café One, Oregun"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-black/60" />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-28 text-white">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-brand-blush sm:text-sm">
            The HERdacity Network · Annual Gathering
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
            Becoming HER 2026
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
            Where a hundred women decide what the next year looks like.
          </p>
          <p className="mt-4 text-sm font-medium text-white/80 sm:text-base">
            Saturday 5 December 2026 · Café One, Oregun, Ikeja, Lagos
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-brand-pink px-8 py-4 font-display font-semibold text-white transition hover:opacity-90"
            >
              Register now
            </a>
            <a
              href="#register"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-4 font-display font-semibold text-white transition hover:bg-white/10"
            >
              How to register
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-pink">
              The gathering
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-brand-charcoal md:text-4xl">
              A day of reflection, honest conversation, connection and intention.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-brand-charcoal/80 md:text-lg">
            <p>
              Becoming HER is our annual gathering, now in its second year. We pause to look at
              the year behind us, what worked, what changed, what we learned and what we are
              ready to leave behind, before turning our attention to the year ahead.
            </p>
            <p>
              The room is intentionally intimate, with women seated together around shared
              tables, close enough to listen, ask questions, share experiences and speak up.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((d) => (
            <div key={d.label} className="rounded-3xl border border-brand-blush bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-pink">
                {d.label}
              </p>
              <p className="mt-3 font-display text-lg font-semibold leading-snug text-brand-charcoal">
                {d.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What the day holds */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-pink">
            What the day holds
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight text-brand-charcoal md:text-4xl">
            Set the year down. Choose the next one.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dayHolds.map((item) => (
              <div key={item.title} className="rounded-3xl bg-brand-off-white p-7">
                <h3 className="font-display text-xl font-semibold text-brand-pink">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-brand-charcoal/80">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm italic text-brand-charcoal/70">
            Speakers will be announced in the coming weeks.
          </p>
        </div>
      </section>

      {/* Last December */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-pink">
          Last December
        </p>
        <h2 className="font-display text-3xl font-bold leading-tight text-brand-charcoal md:text-4xl">
          Becoming HER 2025
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {gallery.map((img) => (
            <div key={img.src} className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* How to register */}
      <section id="register" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-pink">
            How to register
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight text-brand-charcoal md:text-4xl">
            Securing your seat
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-3xl bg-brand-off-white p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink font-display font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-brand-charcoal">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-brand-charcoal/80">{step.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-brand-charcoal/70">
            Registration closes on Wednesday 2 December. There are no sales at the door.
          </p>
        </div>
      </section>

      {/* Final call */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="rounded-[2rem] bg-brand-blush px-6 py-14 text-center md:px-16 md:py-20">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-brand-charcoal md:text-5xl">
            One hundred seats. One day that shapes your year.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-brand-charcoal/80">
            We would love to have you in the room.
          </p>
          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-brand-pink px-10 py-4 font-display font-semibold text-white transition hover:opacity-90"
          >
            Register now
          </a>
          <p className="mt-8 text-sm text-brand-charcoal/70">
            Questions?{" "}
            <a
              href="mailto:theherdacitynetwork@gmail.com"
              className="font-semibold text-brand-pink underline underline-offset-4"
            >
              theherdacitynetwork@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
