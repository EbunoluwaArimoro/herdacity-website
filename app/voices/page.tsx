import VoicesHero from "@/components/sections/voices/VoicesHero";
import VoicesGrid from "@/components/sections/voices/VoicesGrid";
import MemberImpact from "@/components/sections/voices/MemberImpact"; // Changed from Impact to MemberImpact
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function VoicesPage() {
  return (
    <main className="w-full bg-white selection:bg-brand-pink">
      <VoicesHero />
      <VoicesGrid />
      <MemberImpact />
      <CTA />
      <Footer />
    </main>
  );
}