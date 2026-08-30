"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ComingSoonProps {
  label?: string;
  title?: string;
  message?: string;
}

export default function ComingSoon({
  label = "Not quite yet",
  title = "This one is still being built.",
  message = "We are putting it together properly rather than putting it up quickly. In the meantime, here is what is already open to you.",
}: ComingSoonProps) {
  const links = [
    { href: "/resources/post-builder", text: "The Post Builder", note: "Turn what happened into a post" },
    { href: "/programs", text: "Programs", note: "How we work with women" },
    { href: "/events", text: "Events", note: "Where the room gathers next" },
    { href: "/blog", text: "Blog", note: "What we have been writing" },
  ];

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-brand-charcoal px-6 py-32">
      {/* Same radial treatment as the page heroes */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-pink/20 via-brand-charcoal to-brand-charcoal" />
      </div>
      <div className="absolute inset-0 z-10 bg-black/40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 mx-auto w-full max-w-3xl text-center"
      >
        <div className="mb-6 flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-brand-pink md:w-12" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-pink md:text-xs">
            {label}
          </span>
          <div className="h-[1px] w-8 bg-brand-pink md:w-12" />
        </div>

        <h1 className="mb-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-6xl">
          {title}
        </h1>

        <p className="mx-auto mb-14 max-w-2xl text-base font-light leading-relaxed text-white/80 md:text-xl">
          {message}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {links.map((l, i) => (
            <motion.div
              key={l.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
            >
              <Link
                href={l.href}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-left transition-colors hover:border-brand-pink/60 hover:bg-white/10"
              >
                <span className="font-display text-lg font-semibold text-white">
                  {l.text}
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-1 text-sm text-white/50">{l.note}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link
          href="/"
          className="mt-12 inline-block text-sm font-medium text-white/45 transition-colors hover:text-brand-pink"
        >
          Back to the home page
        </Link>
      </motion.div>
    </section>
  );
}
