"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useModal } from "@/context/ModalContext";

// 1. Add this interface to tell TypeScript what props to expect
interface EventsHeroProps {
  title: string;
  subtitle: string;
}

// 2. Update the function to accept { title, subtitle }
export default function EventsHero({ title, subtitle }: EventsHeroProps) {
  const { openModal } = useModal();

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/events-hero.png" 
          alt="HERdacity Events"
          fill
          className="object-cover transition-transform duration-1000 ease-out 
                     scale-[1.15] sm:scale-100 md:scale-105 
                     object-[50%_80%] sm:object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Scrims for Text Legibility */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
      
      {/* CONTENT WRAPPER */}
      <div className="relative z-20 container mx-auto px-6 text-center pt-24 lg:pt-48 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Pill */}
          <div className="inline-block mb-6">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 md:px-8 md:py-3 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
              IRL & Virtual
            </span>
          </div>

          {/* Headline - Updated to use the 'title' prop */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight">
            {title}
          </h1>

          {/* Subtext - Updated to use the 'subtitle' prop */}
          <p className="text-base md:text-xl lg:text-2xl text-white/90 font-light max-w-sm md:max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>

          {/* Action Button */}
          <div className="px-4 sm:px-0">
            <button 
              onClick={openModal} 
              className="inline-block bg-brand-pink text-white px-10 py-4 md:px-12 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-brand-pink transition-all shadow-[0_0_50px_-10px_rgba(246,16,103,0.5)] transform hover:-translate-y-1"
            >
              Join the Network
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}