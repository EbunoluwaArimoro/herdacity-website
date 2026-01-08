"use client";

import { motion } from "framer-motion";

const upcomingEvents = [
  {
    date: "Oct 12",
    title: "The Phoenix Protocol: Rebranding",
    category: "Masterclass",
    description: "Architecting your next high-level career pivot.",
    status: "Open"
  },
  {
    date: "Nov 04",
    title: "Founder's Dinner: Lagos Edit",
    category: "In-Person",
    description: "An intimate evening of connection and community.",
    status: "Waitlist"
  },
  {
    date: "Dec 15",
    title: "2026 Strategy & Roadmap",
    category: "Workshop",
    description: "Structured planning for your audacious year ahead.",
    status: "Open"
  }
];

export default function EventAgenda() {
  return (
    <section className="-mt-24 py-24 bg-[#f7f7f9]">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-charcoal">
              Upcoming Gatherings
            </h2>
            <div className="w-12 h-1 bg-brand-charcoal/10 mt-6 rounded-full"></div>
          </div>

          <div className="flex flex-col">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-brand-charcoal/10 last:border-none hover:border-brand-pink transition-colors duration-300 cursor-default"
              >
                {/* Date & Category */}
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <span className="block text-brand-pink font-serif italic text-2xl mb-1">{event.date}</span>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40 border border-brand-charcoal/10 px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>

                {/* Content */}
                <div className="md:w-1/2 mb-6 md:mb-0 pr-8">
                  <h3 className="text-2xl font-bold text-brand-charcoal group-hover:text-brand-pink transition-colors mb-2">
                    {event.title}
                  </h3>
                  <p className="text-brand-charcoal/60 text-base font-light leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Actions - UPDATED PINK HOVER */}
                <div className="md:w-1/4 flex md:justify-end items-center">
                  {event.status === "Open" ? (
                    <button className="bg-brand-charcoal text-white px-10 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-brand-pink transition-all duration-300 ease-in-out shadow-sm active:scale-95">
                      Register
                    </button>
                  ) : (
                    <span className="inline-block text-center text-brand-charcoal/30 text-[10px] font-semibold uppercase tracking-[0.2em] border border-brand-charcoal/5 px-10 py-2.5 rounded-full bg-neutral-200/20">
                      Full
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}