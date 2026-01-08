import EventsHero from "@/components/sections/events/EventsHero"; 
import VisualManifesto from "@/components/sections/events/VisualManifesto";
import EventAgenda from "@/components/sections/events/EventAgenda";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. YOUR EXISTING HERO */}
      <EventsHero 
        title="Events & Experiences"
        subtitle="Designed for the woman who is ready to build."
      />
      
      {/* 2. THE HIGH-END MASONRY GALLERY */}
      <VisualManifesto />

      {/* 3. THE VERTICAL AGENDA LIST */}
      <EventAgenda />

      {/* 4. FINAL CALL TO ACTION */}
      <CTA />
      <Footer />
    </main>
  );
}