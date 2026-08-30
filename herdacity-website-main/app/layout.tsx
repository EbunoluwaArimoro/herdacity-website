import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ModalProvider } from "@/context/ModalContext"; 

export const metadata: Metadata = {
  title: "HERdacity | A Sisterhood for Women Who Dare",
  description: "A leadership ecosystem and professional growth community for ambitious women.",
  icons: { icon: "/icon-white.png" },
  
  // 1. Social Media Sharing (Open Graph)
  openGraph: {
    title: "HERdacity | A Sisterhood for Women Who Dare",
    description: "A leadership ecosystem and professional growth community for ambitious women.",
    url: "https://herdacity.com",
    siteName: "HERdacity",
    images: [
      {
        url: "/logo-pink.png", // This is the image you asked for
        width: 1200,
        height: 630,
        alt: "HERdacity Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 2. Twitter Card (for Twitter/X specific sharing)
  twitter: {
    card: "summary_large_image",
    title: "HERdacity | A Sisterhood for Women Who Dare",
    description: "A leadership ecosystem and professional growth community for ambitious women.",
    images: ["/logo-pink.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600;700;800&family=Quicksand:wght@500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased selection:bg-brand-pink selection:text-white">
        <ModalProvider>
          <Navbar />
          <main>{children}</main>
        </ModalProvider>
      </body>
    </html>
  );
}