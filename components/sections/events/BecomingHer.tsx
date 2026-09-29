"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";

const REGISTER_URL = "https://luma.com/ikndpol6";

const details = [
  { label: "Date", value: "Saturday 5 December 2026", note: "" },
  { label: "Time", value: "9:00am to 4:00pm", note: "" },
  { label: "Venue", value: "Café One, Oregun, Ikeja, Lagos", note: "" },
  { label: "Ticket", value: "₦25,000", note: "One hundred seats only" },
];

const dayHolds = [
  {
    title: "Reflection",
    desc: "Honest stock of the year behind you, with space to think rather than rush.",
    path: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  },
  {
    title: "Conversation",
    desc: "Sessions with women further ahead, close enough for real questions and real answers.",
    path: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  },
  {
    title: "Connection",
    desc: "Shared tables and small groups, so you leave knowing people rather than just meeting them.",
    path: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  },
  {
    title: "Intention",
    desc: "A guided session to set down what you want from the year ahead, in your own words.",
    path: "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  },
];

const steps = [
  {
    title: "Register on Luma",
    desc: "It takes less than a minute, and your seat is reserved as soon as you do.",
    href: REGISTER_URL,
  },
  {
    title: "Make your transfer",
    desc: "The payment details are in your registration email. Add the name you registered with to the transfer description so we can match it.",
  },
  {
    title: "Receive your ticket",
    desc: "Once your payment reaches us, we confirm your seat and send your ticket and a calendar invite.",
  },
];

const gallery = [
  { src: "/events-hero.png", alt: "A session in the room at Becoming HER 2025" },
  { src: "/gallery-2.jpg", alt: "Lolita Ejiofor and Onyeka Koldsweat Akpaida at Becoming HER 2025" },
  { src: "/gallery-1.jpg", alt: "Members at Becoming HER 2025" },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-[1px] w-12 bg-brand-pink"></div>
      <h3 className="text-brand-charcoal font-bold uppercase tracking-[0.2em] text-xs">{children}</h3>
    </div>
  );
}

export default function BecomingHer() {
  return (
    <>
      {/* 1. HERO */}
      <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/HER pic home.jpg"
            alt="The women of Becoming HER 2025 at Café One, Oregun"
            fill
            className="object-cover transition-transform duration-1000 ease-out 
                       scale-[1.15] sm:scale-100 md:scale-105 
                       object-[50%_80%] sm:object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        {/* Scrims for Text Legibility */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

        <div className="relative z-20 container mx-auto px-6 text-center pt-24 lg:pt-48 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-block mb-6">
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 md:px-8 md:py-3 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                Annual Gathering · 5 December 2026
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Becoming <span className="italic font-serif text-brand-pink">HER.</span>
            </h1>

            <p className="text-base md:text-xl lg:text-2xl text-white/90 font-light max-w-sm md:max-w-2xl mx-auto mb-4 leading-relaxed">
              Where a hundred women decide what the next year looks like.
            </p>
            <p className="text-sm md:text-base text-white/70 font-light mb-10 tracking-wide">
              Café One, Oregun, Ikeja, Lagos
            </p>

            <div className="px-4 sm:px-0">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-pink text-white px-10 py-4 md:px-12 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-brand-pink transition-all shadow-[0_0_50px_-10px_rgba(246,16,103,0.5)] transform hover:-translate-y-1"
              >
                Register now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE GATHERING */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <Eyebrow>The Gathering</Eyebrow>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-charcoal leading-[1.1]">
                A day of reflection and <span className="text-brand-pink italic font-serif">intention.</span>
              </h2>
            </div>
            <div className="space-y-6 text-lg text-brand-charcoal/70 font-light leading-relaxed md:pt-12">
              <p>
                Becoming HER is our annual gathering, now in its second year. We pause to look at the
                year behind us, what worked, what changed, what we learned and what we are ready to
                leave behind, before turning our attention to the year ahead.
              </p>
              <p>
                The room is intentionally intimate, with women seated together around shared tables,
                close enough to listen, ask questions, share experiences and speak up.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {details.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-brand-off-white"
              >
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-pink mb-3">
                  {d.label}
                </span>
                <p className="text-lg font-bold text-brand-charcoal leading-snug">{d.value}</p>
                {d.note && (
                  <p className="mt-2 text-xs italic text-brand-charcoal/50">{d.note}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT THE DAY HOLDS */}
      <section className="py-24 bg-[#f7f7f9]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-charcoal mb-4">
              What the Day Holds
            </h2>
            <div className="w-16 h-1 bg-brand-charcoal/10 mx-auto rounded-full"></div>
            <p className="mt-4 text-xs italic text-brand-charcoal/50">
              Speakers will be announced in the coming weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dayHolds.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-white border border-transparent hover:border-brand-pink/20 hover:shadow-xl transition-all duration-300 cursor-default"
              >
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-full bg-brand-off-white group-hover:bg-brand-pink/10 transition-colors duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-gray-400 group-hover:text-brand-pink transition-colors duration-300"
                  >
                    <path d={item.path} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-3">{item.title}</h3>
                <p className="text-brand-charcoal/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. LAST DECEMBER */}
      <section className="py-24 bg-white selection:bg-brand-pink">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-16">
            <Eyebrow>Last December</Eyebrow>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-charcoal leading-[1.1]">
              Becoming HER <span className="text-brand-pink italic font-serif">2025</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
            {gallery.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
                className="relative aspect-[4/5] overflow-hidden group bg-brand-off-white shadow-sm"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW TO REGISTER */}
      <section id="register" className="py-24 bg-[#f7f7f9] scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <Eyebrow>How to Register</Eyebrow>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-charcoal leading-[1.1]">
                Secure your <span className="text-brand-pink italic font-serif">seat.</span>
              </h2>
              <p className="mt-4 text-xs italic text-brand-charcoal/50">
                Registration closes on Wednesday 2 December.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-white"
                >
                  <span className="flex w-12 h-12 items-center justify-center rounded-full bg-brand-pink text-white font-display font-bold text-lg mb-6">
                    {i + 1}
                  </span>
                  {"href" in step && step.href ? (
                    <a
                      href={step.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center text-xl font-bold text-brand-pink mb-3 underline underline-offset-4 decoration-brand-pink/30 hover:decoration-brand-pink transition-colors"
                    >
                      {step.title}
                      <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  ) : (
                    <h3 className="text-xl font-bold text-brand-charcoal mb-3">{step.title}</h3>
                  )}
                  <p className="text-brand-charcoal/70 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-[#fff5f8] to-white" />
        <motion.div
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#F12B78]/10 rounded-full blur-[80px] md:blur-[120px]"
        />
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-4xl md:text-7xl font-display font-bold text-brand-charcoal mb-8 leading-[1.2] md:leading-[1.1] tracking-tight">
                One day that <br className="hidden md:block" />
                <span className="relative inline-block text-brand-charcoal">
                  shapes your year.
                  <svg
                    className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-5 text-[#F12B78]"
                    viewBox="0 0 300 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M1 9.5C50 3.5 150 1.5 299 9.5"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    />
                  </svg>
                </span>
              </h2>

              <p className="text-lg md:text-2xl text-brand-charcoal/70 mb-10 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                We would love to have you in the room.
              </p>

              <motion.a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, backgroundColor: "#FFFFFF", color: "#F12B78" }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center bg-[#F12B78] text-white px-10 md:px-14 py-4 md:py-6 rounded-full font-bold text-base md:text-xl transition-all shadow-[0_0_50px_-10px_rgba(241,43,120,0.5)]"
              >
                <span className="relative z-10">Register now</span>
                <span className="relative z-10 ml-3 transition-transform group-hover:translate-x-2">→</span>
              </motion.a>

              <p className="mt-10 text-sm text-brand-charcoal/60">
                Questions?{" "}
                <a
                  href="mailto:theherdacitynetwork@gmail.com"
                  className="font-semibold text-brand-pink underline underline-offset-4"
                >
                  theherdacitynetwork@gmail.com
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
