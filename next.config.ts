import type { NextConfig } from "next";

// Add any future URLs here that you want to show the "Coming Soon" page
const comingSoonPaths: string[] = [
  "/mentorship",
  "/membership",
];

const nextConfig: NextConfig = {
  // The By Design board (Becoming HER 2026) is a static app in public/bydesign
  async rewrites() {
    return [
      { source: "/bydesign", destination: "/bydesign/index.html" },
      { source: "/bydesign/", destination: "/bydesign/index.html" },
    ];
  },
  async headers() {
    return [
      { source: "/bydesign/bank/full/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/bydesign/bank/thumb/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/bydesign/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/bydesign/sw.js", headers: [{ key: "Cache-Control", value: "no-cache" }] },
    ];
  },
  async redirects() {
    return comingSoonPaths.map((path) => ({
      source: path,
      destination: "/coming-soon",
      permanent: false, // Temporary redirect so browsers don't cache it
    }));
  },
};

export default nextConfig;