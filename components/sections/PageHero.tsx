"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface PageHeroProps {
  label: string;
  title: React.ReactNode;
  subtitle: string;
  image?: string; // Optional background image
}

export default function PageHero({ label, title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[500px] w-full flex flex-col items-center justify-center overflow-hidden bg-brand-charcoal">
      
      {/* Background Image or Gradient */}
      <div className="absolute inset-0 z-0 opacity-40">
        {image ? (
          <Image
            src={image} 
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-pink/20 via-brand-charcoal to-brand-charcoal" />
        )}
      </div>

      {/* Scrims */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-8 md:w-12 bg-brand-pink"></div>
            <span className="text-brand-pink font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
              {label}
            </span>
            <div className="h-[1px] w-8 md:w-12 bg-brand-pink"></div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.1]">
            {title}
          </h1>

          {/* Subtext */}
          <p className="text-base md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}