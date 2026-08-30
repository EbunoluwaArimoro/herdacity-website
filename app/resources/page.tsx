"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

const RESOURCES = [
  {
    status: "live" as const,
    eyebrow: "Own Your Voice",
    title: "Nara",
    blurb:
      "You have industry-shifting ideas, but staring at a blank screen drains your momentum. Nara transforms your raw thoughts into polished, high-impact content structured for visibility. Build your personal brand without second-guessing your expertise.",
    cta: "Draft with Nara",
    href: "/resources/nara",
  },
];

export default function ResourcesPage() {
  const live = RESOURCES.filter((r) => r.status === "live");

  return (
    <main className="w-full bg-white selection:bg-brand-pink selection:text-white">
      <PageHero
        label="The Toolkit"
        title={
          <>
            Built to amplify <br className="hidden md:block" />
            your impact.
          </>
        }
        subtitle="Practical, no-nonsense tools designed to remove friction from your workflow and accelerate your career. Free, and yours to run with."
      />

      {/* Featured resources */}
      <section className="relative bg-white py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-14 flex items-center gap-4"
            >
              <div className="h-[1px] w-8 bg-brand-pink md:w-12" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-pink md:text-xs">
                Open now
              </span>
            </motion.div>

            <div className="space-y-6">
              {live.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={r.href}
                    className="group relative block overflow-hidden rounded-[2rem] bg-brand-charcoal p-8 transition-shadow hover:shadow-[0_0_60px_-15px_rgba(246,16,103,0.45)] md:p-14"
                  >
                    {/* Brand glow */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full bg-brand-pink/20 blur-[100px] transition-opacity duration-500 group-hover:opacity-150" />

                    <div className="relative z-10 max-w-2xl">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-pink md:text-xs">
                        {r.eyebrow}
                      </span>

                      <h2 className="mb-5 mt-4 font-display text-3xl font-bold leading-tight text-white md:text-5xl">
                        {r.title}
                      </h2>

                      <p className="mb-9 text-base font-light leading-relaxed text-white/70 md:text-lg">
                        {r.blurb}
                      </p>

                      <span className="inline-flex items-center gap-3 rounded-full bg-brand-pink px-8 py-4 font-display text-sm font-bold text-white transition-all group-hover:bg-white group-hover:text-brand-pink md:text-base">
                        {r.cta}
                        <ArrowRight
                          size={18}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}