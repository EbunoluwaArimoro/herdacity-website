import type { Metadata } from "next";
import PostBuilder from "./PostBuilder";

export const metadata: Metadata = {
  title: "Post Builder | The HERdacity Network",
  description:
    "Tell it what happened. It asks the questions you would have left out, then writes the post in your voice.",
  openGraph: {
    title: "Post Builder | The HERdacity Network",
    description:
      "Tell it what happened. It asks the questions you would have left out, then writes the post in your voice.",
    url: "https://herdacity.com/resources/post-builder",
    siteName: "HERdacity",
    images: [{ url: "/logo-pink.png", width: 1200, height: 630, alt: "HERdacity" }],
    type: "website",
  },
};

export default function Page() {
  return <PostBuilder />;
}
