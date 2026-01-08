"use client";
import Image from "next/image";

export default function Programs() {
  return (
    <section className="py-32 bg-brand-off-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-display font-bold text-brand-charcoal mb-4">
              Engineered for Growth.
            </h2>
            <p className="text-brand-charcoal/60 text-lg">
              Our expertise isn't abstract. We run structured programs designed to move the needle on your career.
            </p>
          </div>
          <a href="/programs" className="text-brand-pink font-bold hover:text-brand-charcoal transition-colors border-b-2 border-brand-pink pb-1">
            View All Programs
          </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-brand-charcoal/5 hover:border-brand-pink/20 transition-all hover:-translate-y-2 duration-300">
            <div className="w-12 h-12 bg-brand-pink/10 rounded-full flex items-center justify-center mb-6 text-brand-pink font-bold text-xl">01</div>
            <h3 className="text-2xl font-bold text-brand-charcoal mb-4">LinkedIn Growth</h3>
            <p className="text-brand-charcoal/70 mb-8">
              A strict accountability group focused on posting consistency, engagement, and algorithmic authority.
            </p>
            <ul className="space-y-3 text-sm text-brand-charcoal/60">
              <li className="flex items-center gap-2">✓ Profile Optimization</li>
              <li className="flex items-center gap-2">✓ Content Strategy</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-brand-charcoal text-white p-8 rounded-2xl border border-brand-charcoal/5 hover:-translate-y-2 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/20 blur-3xl rounded-full"></div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl relative z-10">02</div>
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Masterclasses</h3>
            <p className="text-white/70 mb-8 relative z-10">
              Monthly sessions with industry experts on negotiation, leadership, and technical excellence.
            </p>
            <ul className="space-y-3 text-sm text-white/50 relative z-10">
              <li className="flex items-center gap-2">✓ Live Q&A Sessions</li>
              <li className="flex items-center gap-2">✓ Practical Workshops</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-brand-charcoal/5 hover:border-brand-pink/20 transition-all hover:-translate-y-2 duration-300">
            <div className="w-12 h-12 bg-brand-pink/10 rounded-full flex items-center justify-center mb-6 text-brand-pink font-bold text-xl">03</div>
            <h3 className="text-2xl font-bold text-brand-charcoal mb-4">Career Clarity</h3>
            <p className="text-brand-charcoal/70 mb-8">
              Deep-dive sessions for career switchers to translate past value into future tech roles.
            </p>
            <ul className="space-y-3 text-sm text-brand-charcoal/60">
              <li className="flex items-center gap-2">✓ Resume Reviews</li>
              <li className="flex items-center gap-2">✓ Role Matching</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}