"use client";
import Image from "next/image";

export default function Founder() {
  return (
    <section className="py-32 bg-brand-off-white border-y border-brand-charcoal/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          
          {/* Image Side - Smaller, Dignified */}
          <div className="w-full max-w-md lg:w-1/3 relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <Image 
              src="/founder.jpg" 
              alt="Ebunoluwa Arimoro"
              fill
              className="object-cover"
            />
          </div>

          {/* Text Side - Community Focused */}
          <div className="w-full lg:w-1/2">
            <span className="text-brand-pink font-bold tracking-widest text-xs uppercase mb-4 block">
              From the Founder
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-charcoal mb-8">
              Why HERdacity exists.
            </h2>
            
            <div className="space-y-6 text-lg text-brand-charcoal/70 font-light leading-relaxed">
              <p>
                I didn't start HERdacity to be a "founder." I started it because I saw too many brilliant women shrinking in rooms where they belonged.
              </p>
              <p>
                As an engineer, I look for broken systems. The system of career visibility for women was broken. We were working hard, but in isolation.
              </p>
              <p>
                HERdacity is the solution to that isolation. It is a space where you don't have to pretend to have it all figured out. We build, we learn, and we show up—<strong className="text-brand-charcoal font-semibold">together.</strong>
              </p>
            </div>

            <div className="mt-8">
              <p className="font-display font-bold text-xl text-brand-charcoal">
                Ebunoluwa Arimoro
              </p>
              <p className="text-sm text-brand-charcoal/50">Lead Steward, The HERdacity Network</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}