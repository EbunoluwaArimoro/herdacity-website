"use client";
import { motion } from "framer-motion";

export default function Manifesto() {
  return (
    <section className="py-24 relative overflow-hidden bg-brand-pink/5 border-t border-brand-charcoal/5">
      
      {/* Decorative Quote Mark Background */}
      <div className="absolute top-10 left-10 text-brand-pink/5 font-serif text-[20rem] leading-none select-none -z-10 pointer-events-none font-bold">
        &ldquo;
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Enhanced Subheading Design */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-brand-charcoal/20"></div>
            <h3 className="text-brand-charcoal font-bold uppercase tracking-[0.2em] text-xs">Our Philosophy</h3>
            <div className="h-[1px] w-12 bg-brand-charcoal/20"></div>
          </div>

          <p className="text-2xl md:text-4xl lg:text-5xl font-display text-brand-charcoal leading-tight font-medium">
            "We believe ambition shouldn't be lonely. <br className="hidden md:block" />
            HERdacity exists to replace isolation with <span className="text-brand-pink italic font-serif">structure</span> and effort with <span className="text-brand-pink italic font-serif">visibility</span>."
          </p>
        </motion.div>
      </div>
    </section>
  );
}