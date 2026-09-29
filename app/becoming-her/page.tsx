import type { Metadata } from "next";
import BecomingHer from "@/components/sections/events/BecomingHer";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Becoming HER 2026 | HERdacity",
  description:
    "Our annual gathering. A day of reflection, honest conversation, connection and intention. Saturday 5 December 2026, Café One, Oregun, Ikeja, Lagos.",
  openGraph: {
    title: "Becoming HER 2026 | HERdacity",
    description: "Where a hundred women decide what the next year looks like. Saturday 5 December 2026, Lagos.",
    url: "https://herdacity.com/becoming-her",
    siteName: "HERdacity",
    images: [{ url: "https://www.herdacity.com/HER%20pic%20home.jpg", alt: "Becoming HER 2025" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Becoming HER 2026 | HERdacity",
    description: "Where a hundred women decide what the next year looks like. Saturday 5 December 2026, Lagos.",
    images: ["https://www.herdacity.com/HER%20pic%20home.jpg"],
  },
};

export default function BecomingHerPage() {
  return (
    <main className="min-h-screen bg-white">
      <BecomingHer />
      <Footer />
    </main>
  );
}
