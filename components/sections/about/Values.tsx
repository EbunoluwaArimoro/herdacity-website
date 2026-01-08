"use client";
import { motion } from "framer-motion";

const values = [
  {
    title: "Confidence",
    desc: "Supporting women to trust their voice and abilities.",
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
  },
  {
    title: "Community",
    desc: "Growth happens best when women support women.",
    path: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M16 3.13a4 4 0 010 7.75 M23 21v-2a4 4 0 00-3-3.87"
  },
  {
    // REPLACED "Visibility" with "Presence"
    title: "Presence", 
    desc: "Encouraging women to be seen, heard, and recognized.",
    path: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 10a2 2 0 100-4 2 2 0 000 4z"
  },
  {
    title: "Audacity",
    desc: "Showing up boldly, even when it feels uncomfortable.",
    path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
  }
];

export default function Values() {
  return (
    <section className="py-24 bg-white border-t border-brand-charcoal/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-brand-charcoal">Core Values</h2>
          <div className="w-12 h-1 bg-brand-charcoal/10 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group text-center p-8 rounded-2xl bg-brand-off-white hover:bg-white border border-transparent hover:border-brand-pink/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-white group-hover:bg-brand-pink/10 transition-colors duration-300 shadow-sm">
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
              <p className="text-brand-charcoal/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}