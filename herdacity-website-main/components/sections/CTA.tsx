"use client";
import { motion } from "framer-motion";
import { useModal } from "@/context/ModalContext";

export default function CTA() {
    const { openModal } = useModal();
    
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      
      {/* 1. BRAND COHESIVE BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-[#fff5f8] to-white" />
      
      {/* 2. HIGH-INTENSITY BRAND GLOWS */}
      <motion.div 
        animate={{ 
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#F12B78]/10 rounded-full blur-[80px] md:blur-[120px]" 
      />
      
      {/* 3. TEXTURE: Cinematic Grain */}
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
              Ready to stop <br className="hidden md:block" />
              <span className="relative inline-block text-brand-charcoal">
                playing small?
                {/* FIXED SVG UNDERLINE */}
                <svg 
                  className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-5 text-[#F12B78]" 
                  viewBox="0 0 300 12" 
                  fill="none" 
                  preserveAspectRatio="none" // Allows stretching on mobile
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
              Join a network of women who are rewriting the rules of <span className="font-semibold text-brand-charcoal">leadership</span> and <span className="font-semibold text-brand-charcoal">visibility</span>.
            </p>

            {/* SIGNATURE PINK BUTTON */}
            <motion.button 
  onClick={openModal} 
  whileHover={{ 
    scale: 1.05,
    backgroundColor: "#FFFFFF", // Switches to white on hover like your target button
    color: "#F12B78",           // Text turns pink on hover
  }}
  whileTap={{ scale: 0.98 }}
  className="group relative inline-flex items-center justify-center bg-[#F12B78] text-white px-10 md:px-14 py-4 md:py-6 rounded-full font-bold text-base md:text-xl transition-all shadow-[0_0_50px_-10px_rgba(241,43,120,0.5)]"
>
  <span className="relative z-10">Join the Sisterhood</span>
  <span className="relative z-10 ml-3 transition-transform group-hover:translate-x-2">
    →
  </span>
</motion.button>

          </motion.div>
        </div>
      </div>
    </section>
  );
}