"use client";
import { motion } from "framer-motion";

export default function Philosophy() {
  return (
    <section className="py-32 bg-white relative overflow-hidden flex items-center justify-center text-center">
      
      {/* Background Decor - Subtle grain */}
      <div className="absolute inset-0 opacity-[0.3] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-10 flex justify-center">
            <span className="text-brand-charcoal font-bold uppercase tracking-[0.2em] text-xs">
              Our Philosophy
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-charcoal leading-tight mb-8">
            "Leadership isn't a title you wait for. <br className="hidden md:block" />
            It's a posture you take."
          </h2>
          
          <p className="text-xl text-brand-charcoal/60 font-light leading-relaxed max-w-2xl mx-auto">
            <strong className="text-brand-pink">HERdacity</strong> is for the woman who is ready to stop waiting for permission and start building her legacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}