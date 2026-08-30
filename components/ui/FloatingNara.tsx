"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function FloatingNara() {
  const pathname = usePathname();

  // Hide the floating button if the user is already using Nara
  if (pathname === "/resources/nara") return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-[90] md:bottom-10 md:right-10"
    >
      <Link
        href="/resources/nara"
        className="group flex items-center gap-3 rounded-full bg-brand-charcoal px-5 py-4 font-display text-sm font-bold text-white shadow-2xl transition-all hover:-translate-y-1 hover:bg-brand-pink hover:shadow-[0_0_30px_-5px_rgba(246,16,103,0.5)]"
      >
        <Sparkles size={20} className="text-brand-pink transition-colors group-hover:text-white" />
        <span className="hidden md:inline-block">Use Nara</span>
      </Link>
    </motion.div>
  );
}