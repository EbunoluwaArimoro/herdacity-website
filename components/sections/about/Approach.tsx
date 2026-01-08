"use client";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Structure",
    desc: "Ambition without a plan is just a dream. We replace random effort with weekly check-ins, clear goals, and accountability loops."
  },
  {
    num: "02",
    title: "Visibility",
    desc: "We demystify personal branding. You will learn to articulate your value and own your achievements without apology."
  },
  {
    num: "03",
    title: "Connection",
    desc: "Networking that doesn't feel transactional. Connect with peers who are as ambitious as you are, for actual career growth."
  }
];

export default function CommunityWorks() {
  return (
    <section className="py-24 md:py-32 bg-[#faf9f6]">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-charcoal mb-4">
            How the Community Works
          </h2>
          <div className="w-16 h-1 bg-brand-charcoal/10 mx-auto rounded-full"></div>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-charcoal/5 group"
            >
              <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center mb-8 text-brand-pink font-bold text-2xl group-hover:bg-brand-pink group-hover:text-white transition-colors duration-300">
                {item.num}
              </div>
              
              <h3 className="text-2xl font-bold text-brand-charcoal mb-4">{item.title}</h3>
              
              <p className="text-brand-charcoal/70 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}