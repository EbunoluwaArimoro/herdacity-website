"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// UPDATED DATA WITH CORRECT SENTENCE CASE
const voices = [
  {
    name: "Alice Arimoro",
    image: "alice.jpg",
    story: "After joining HERdacity, what changed for me was the sense of grounding and clarity I felt in my personal and professional goals. What started as a space to build a personal brand on LinkedIn evolved into something much deeper and more meaningful.",
    role: "Member"
  },
  {
    name: "Christianah Arowolo",
    image: "christianah.jpg",
    story: "Meeting real women, solving real problems and figuring it out completely changed my perspective about female focused communities. HERdacity has supported my growth through our weekly meet-ups which tackles unspoken challenges.",
    role: "Member"
  },
  {
    name: "Modupe Laosun",
    image: "modupe.jpg",
    story: "I gained clarity and confidence after joining HERdacity. Being around women who are also building and figuring things out reminded me that I’m not alone and that my journey is valid.",
    role: "Member"
  },
  {
    name: "Mariam Yusuf",
    image: "mariam.jpg",
    story: "HERdacity has been so impactful for me because it creates a space where my 'Ambitiousness' does not have to be masked or softened. It has been a community that has reminded me that I don’t have to figure everything out alone.",
    role: "Member"
  },
  {
    name: "Viola Echere",
    image: "viola.jpg",
    story: "HERdacity created that opportunity to meet women like me who are also on similar paths. Understanding that as a woman I am not alone in this journey of self growth and development. HERdacity to me means sisterhood, family, and girlpower.",
    role: "Member"
  },
  {
    name: "Feyisiyunmi Akinyeye",
    image: "feyi.jpg",
    story: "After joining HERdacity, I learned the power of showing up. How consistency actually works, how results compound over time, and how team bonding plays a huge role in growth.",
    role: "Member"
  }
];

export default function Voices() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) containerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (containerRef.current) containerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#f7f7f9] overflow-hidden border-t border-brand-charcoal/5">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="h-[2px] w-8 bg-brand-pink"></div>
               <span className="text-brand-charcoal font-bold tracking-widest text-xs uppercase">Social Proof</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-brand-charcoal">
              HERdacity Voices
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-4">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-brand-charcoal/10 bg-white flex items-center justify-center hover:bg-brand-pink hover:border-brand-pink hover:text-white transition-all shadow-sm"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border border-brand-charcoal/10 bg-white flex items-center justify-center hover:bg-brand-pink hover:border-brand-pink hover:text-white transition-all shadow-sm"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div 
          ref={containerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-10"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {voices.map((voice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[85vw] md:min-w-[420px] snap-center bg-white p-10 rounded-2xl border border-brand-charcoal/5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 text-brand-pink text-5xl font-serif leading-none">“</div>
                <p className="text-lg leading-relaxed text-brand-charcoal/80 mb-4 font-light italic line-clamp-4">
                  {voice.story}
                </p>
                
                <Link 
                  href="/voices" 
                  className="group inline-flex items-center gap-1 text-sm font-bold text-brand-pink hover:text-brand-charcoal transition-colors"
                >
                  Read more
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-4 pt-6 border-t border-brand-charcoal/5 mt-8">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-pink/10 shrink-0">
                  <Image
                    src={`/${voice.image}`}
                    alt={voice.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-brand-charcoal leading-tight">{voice.name}</p>
                  <p className="text-xs text-brand-charcoal/40 uppercase tracking-widest mt-1">{voice.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="min-w-[5vw] md:min-w-[1px]" />
        </div>
      </div>
    </section>
  );
}