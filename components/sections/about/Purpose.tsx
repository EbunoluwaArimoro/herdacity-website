"use client";
import { motion } from "framer-motion";

export default function Purpose() {
  return (
    <section className="py-24 md:py-32 bg-brand-pink/5 border-b border-brand-charcoal/5 relative overflow-hidden">
      
      {/* Decorative Background Element */}
      <div className="absolute top-10 left-4 md:left-10 text-brand-pink/10 font-serif text-[15rem] md:text-[20rem] leading-none select-none -z-10 pointer-events-none font-bold">
        &ldquo;
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="mb-8 flex justify-center">
             <div className="flex items-center gap-3">
               <div className="h-[2px] w-8 bg-brand-pink"></div>
               <span className="text-brand-charcoal font-bold tracking-widest text-xs uppercase">The Purpose</span>
               <div className="h-[2px] w-8 bg-brand-pink"></div>
             </div>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-brand-charcoal leading-[1.1] mb-12"
          >
            Talent is evenly distributed. <br />
            <span className="text-brand-pink italic font-serif">Opportunity is not.</span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-8 text-lg md:text-xl text-brand-charcoal/70 leading-relaxed font-light text-left md:text-center max-w-3xl mx-auto"
          >
            <p>
              HERdacity was created to bridge the gap between <strong className="text-brand-charcoal font-medium">effort</strong> and <strong className="text-brand-charcoal font-medium">opportunity</strong>.
            </p>
            <p>
              Too many capable women are doing everything right—learning, working, showing up—yet remain under-visible. Not due to lack of talent, but due to growing in isolation.
            </p>
            <p>
              We turn visibility into opportunity through structured accountability, practical personal branding guidance, and a safe environment for growth.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}