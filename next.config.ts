import type { NextConfig } from "next";

// Add any future URLs here that you want to show the "Coming Soon" page
const comingSoonPaths: string[] = [
  "/mentorship",
  "/membership",
];

const nextConfig: NextConfig = {
  async redirects() {
    return comingSoonPaths.map((path) => ({
      source: path,
      destination: "/coming-soon",
      permanent: false, // Temporary redirect so browsers don't cache it
    }));
  },
};

export default nextConfig;