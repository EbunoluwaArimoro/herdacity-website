import Hero from "@/components/sections/Hero";
import Pathways from "@/components/sections/Pathways";
import Manifesto from "@/components/sections/Manifesto";
import WhatYouGet from "@/components/sections/WhatYouGet";
import Voices from "@/components/sections/Voices";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="w-full bg-white selection:bg-brand-pink selection:text-white">
      {/* 1. Vision */}
      <Hero />
      
      {/* 2. Audience (Who is this for?) - White BG */}
      <Pathways />
      
      {/* 3. Philosophy (The Bridge) - Brand Pink/5 BG */}
      <Manifesto />
      
      {/* 4. Value Pillars (What You Get) - White BG */}
      <WhatYouGet />
      
      {/* 5. Proof (Testimonials Carousel) - White BG */}
      <Voices />
      
      {/* 6. Action */}
      <CTA />
      
      {/* 7. Footer - Black */}
      <Footer />
    </main>
  );
}