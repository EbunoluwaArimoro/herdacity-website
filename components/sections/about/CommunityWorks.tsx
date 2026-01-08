"use client";
import { motion } from "framer-motion";

export default function CommunityWorks() {
  // Moving steps inside the function ensures it is always defined
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

  return (
    <section className="py-24 bg-white border-b border-brand-charcoal/5">
      <div className="w-full max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-charcoal mb-4">
            How the Community Works
          </h2>
          <div className="w-16 h-1 bg-brand-charcoal/10 mx-auto rounded-full"></div>
        </div>

        {/* FORCE 3 COLUMNS: 
           - 'flex-col' on mobile 
           - 'md:flex-row' on laptop
           - 'w-full md:w-1/3' ensures they stay 3-across no matter what
        */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex-1 text-center p-8 rounded-2xl 
                         bg-brand-off-white hover:bg-white 
                         border border-transparent hover:border-brand-pink/30 
                         hover:shadow-2xl transition-all duration-500 ease-out 
                         hover:-translate-y-2"
            >
              {/* Number Circle */}
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-white group-hover:bg-brand-pink/10 transition-all duration-500 shadow-sm">
                <span className="text-brand-charcoal/30 group-hover:text-brand-pink font-bold text-2xl transition-colors duration-500">
                  {item.num}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-brand-charcoal mb-4 transition-colors duration-500">
                {item.title}
              </h3>
              
              <p className="text-brand-charcoal/60 text-base leading-relaxed transition-colors duration-500 group-hover:text-brand-charcoal/90">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}