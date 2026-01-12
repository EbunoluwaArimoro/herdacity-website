import EventsHero from "@/components/sections/events/EventsHero"; 
import VisualManifesto from "@/components/sections/events/VisualManifesto";
import EventAgenda from "@/components/sections/events/EventAgenda";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO with Styling applied to "Experiences" */}
      <EventsHero 
        title={
          <>
            Events & <span className="text-brand-pink font-serif italic">Experiences</span>
          </>
        }
        subtitle="Designed for the woman who is ready to build."
      />
      
      {/* 2. GALLERY */}
      <VisualManifesto />

      {/* 3. AGENDA */}
      <EventAgenda />

      {/* 4. CTA & FOOTER */}
      <CTA />
      <Footer />
    </main>
  );
}