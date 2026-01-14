"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Founder() {
  return (
    <section className="py-24 md:py-32 bg-[#faf9f6] border-b border-brand-charcoal/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-16 lg:gap-24">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-7 w-full max-w-md lg:w-[45%] relative aspect-[3/4] group cursor-default"
          >
            {/* Main Image Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border-2 border-transparent group-hover:border-brand-pink">
              <Image 
                src="/founder.jpg" 
                alt="Ebunoluwa Arimoro"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Pink Tint on Hover */}
              <div className="absolute inset-0 bg-brand-pink/0 group-hover:bg-brand-pink/10 transition-colors duration-500 mix-blend-multiply" />
            </div>
            
            {/* Decorative Offset Border (Pink) */}
            <div className="absolute top-4 -right-4 w-full h-full rounded-2xl border-2 border-brand-pink/20 -z-10 hidden md:block transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 pt-8"
          >
            <div className="flex items-center gap-3 mb-6">
               <div className="h-[2px] w-8 bg-brand-pink"></div>
               <span className="text-brand-charcoal font-bold tracking-widest text-xs uppercase">Why HERdacity Exists</span>
            </div>
            
            <div className="space-y-6 text-lg text-brand-charcoal/80 font-light leading-relaxed">
              <p>
                I’m a software engineer and product builder with a deep interest in how people show up, grow, and lead—especially women.
              </p>
              <p>
                Over time, I noticed a pattern: So many women are talented, intelligent, and capable yet hesitant to be visible or unsure how to position themselves confidently in professional spaces. Not because they lacked value, but because they lacked structure, support, and the right environment to grow consistently.
              </p>
              
              <div className="pl-6 border-l-4 border-brand-pink/30 my-6">
                <p className="font-display font-bold text-xl text-brand-charcoal">
                  HERdacity was born from that gap.
                </p>
              </div>

              <p>
                I created this space so women can build confidence, clarity, and consistency together—without pressure to perform, but with accountability to grow. This community is not about becoming someone else. It’s about becoming more of who you already are and being seen for it.
              </p>
            </div>

            {/* Signature Block - Increased Spacing (mt-20) & Black Text */}
            <div>
              <p className="font-display font-bold text-2xl text-brand-charcoal">
                <br />
                Ebunoluwa Arimoro
              </p>
              <p className="text-brand-charcoal font-medium text-sm uppercase tracking-widest mt-2">
                Founder, The HERdacity Network
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}