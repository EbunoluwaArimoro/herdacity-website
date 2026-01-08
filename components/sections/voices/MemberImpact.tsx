"use client";

import { motion } from "framer-motion";

const values = [
  { 
    title: "Consistency", 
    desc: "Show up and engage; your presence matters in this room. Your consistency is your currency." 
  },
  { 
    title: "Authenticity", 
    desc: "Share your journey, wins, and lessons genuinely. We value the process as much as the result." 
  },
  { 
    title: "Support", 
    desc: "Celebrate, mentor, and help fellow women succeed. When one of us wins, we all win." 
  },
  { 
    title: "Growth Mindset", 
    desc: "Always learning, experimenting, and leveling up. We are architecting the next version of ourselves." 
  },
];

export default function CommunityManifesto() {
  return (
    <section className="py-32 bg-black text-white overflow-hidden relative border-t border-white/5">
      {/* 2026 Background Decoration */}
      <div className="absolute top-0 right-0 p-10 pointer-events-none select-none opacity-[0.03] hidden lg:block">
        <h2 className="text-[12rem] font-display font-black leading-none uppercase">Foundation</h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-brand-pink"></div>
            <h3 className="text-brand-pink font-bold uppercase tracking-[0.4em] text-[10px]">
              The HERdacity Way
            </h3>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] tracking-tight">
            Built on <span className="italic font-serif text-brand-pink">Accountability.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="relative group"
            >
              {/* Vertical Architectural Line */}
              <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-pink/50 to-transparent"></div>
              
              <h4 className="text-brand-pink font-bold uppercase tracking-[0.2em] text-sm mb-4 group-hover:translate-x-1 transition-transform duration-500">
                {val.title}
              </h4>
              <p className="text-white/50 text-base leading-relaxed font-light">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}