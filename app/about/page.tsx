import AboutHero from "@/components/sections/about/AboutHero";
import Purpose from "@/components/sections/about/Purpose";
import Founder from "@/components/sections/about/Founder";
import Activities from "@/components/sections/about/Activities"; // NEW SECTION
import CommunityWorks from "@/components/sections/about/CommunityWorks";
import Values from "@/components/sections/about/Values";
import CTA from "@/components/sections/CTA"; 
import Footer from "@/components/layout/Footer"; 

export default function AboutPage() {
  return (
    <main className="w-full bg-white selection:bg-brand-pink selection:text-white">
      <AboutHero />
      <Founder />
      <CommunityWorks />
      <Purpose />
      <Values />
      <Activities />
      <CTA />
      <Footer />
    </main>
  );
}