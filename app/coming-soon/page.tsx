import type { Metadata } from "next";
import ComingSoon from "@/components/sections/ComingSoon";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Coming Soon | The HERdacity Network",
  description: "This part of HERdacity is still being built.",
};

export default function ComingSoonPage() {
  return (
    <main className="w-full selection:bg-brand-pink selection:text-white">
      <ComingSoon />
      <Footer />
    </main>
  );
}
