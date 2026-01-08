"use client";
import { motion } from "framer-motion";

const points = [
  {
    title: "Project-Based Learning",
    desc: "We don't do theory for theory's sake. Every course ends with a tangible asset you can add to your portfolio.",
    tag: "Practical"
  },
  {
    title: "Expert-Led Sessions",
    desc: "Learn directly from women who are actually doing the work in top tech companies and startups.",
    tag: "Mentorship"
  },
  {
    title: "Peer Accountability",
    desc: "Learning alone is hard. Our cohort model ensures you have a squad cheering you on every week.",
    tag: "Community"
  }
];

export default function Methodology() {
  return (
    <section className="py-24 bg-white border-b border-brand-charcoal/5">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
               <div className="h-[2px] w-8 bg-brand-pink"></div>
               <span className="text-brand-charcoal font-bold tracking-widest text-xs uppercase">The Approach</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-charcoal">
              How We Learn
            </h2>
          </div>

          <div className="flex flex-col">
            {points.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-brand-charcoal/10 last:border-none hover:border-brand-pink transition-colors duration-300 cursor-default"
              >
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold text-brand-charcoal group-hover:text-brand-pink transition-colors">
                    {item.title}
                  </h3>
                  <span className="inline-block mt-2 text-xs font-bold uppercase tracking-widest text-brand-charcoal/40">
                    {item.tag}
                  </span>
                </div>
                
                <div className="md:w-1/2">
                  <p className="text-brand-charcoal/70 text-lg leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
                
                <div className="hidden md:block text-brand-charcoal/20 group-hover:text-brand-pink group-hover:translate-x-2 transition-all duration-300 font-display text-2xl">
                  →
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}