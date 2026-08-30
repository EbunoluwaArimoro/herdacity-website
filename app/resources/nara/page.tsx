import type { Metadata } from "next";
import Nara from "./Nara";

export const metadata: Metadata = {
  title: "Nara | The HERdacity Network",
  description:
    "Stop overthinking your content. Nara transforms your raw thoughts into polished, high-impact posts structured for visibility and authority.",
  openGraph: {
    title: "Nara | The HERdacity Network",
    description:
      "Stop overthinking your content. Nara transforms your raw thoughts into polished, high-impact posts structured for visibility and authority.",
    url: "https://herdacity.com/resources/nara",
    siteName: "HERdacity",
    images: [{ url: "/logo-pink.png", width: 1200, height: 630, alt: "HERdacity" }],
    type: "website",
  },
};

export default function Page() {
  return <Nara />;
}