import ProgramsHero from "@/components/sections/programs/ProgramsHero";
import Methodology from "@/components/sections/programs/Methodology";
import Curriculum from "@/components/sections/programs/Curriculum";
import ProgramFeatures from "@/components/sections/programs/ProgramFeatures"; // New Section
import CTA from "@/components/sections/CTA"; 
import Footer from "@/components/layout/Footer"; 

export default function ProgramsPage() {
  return (
    <main className="w-full bg-white selection:bg-brand-pink selection:text-white">
      <ProgramsHero />
      <Curriculum />
      <Methodology />
      <ProgramFeatures />
      <CTA />
      <Footer />
    </main>
  );
}