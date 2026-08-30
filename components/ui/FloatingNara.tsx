"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PenLine, X } from "lucide-react";

const DISMISS_KEY = "nara_fab_dismissed";

export default function FloatingNara() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume hidden until we have checked

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  // Hold it back until she has started reading, so it never lands on top of a
  // hero the moment the page opens. Short pages get it on a timer instead.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 240) setVisible(true);
    };

    const timer = setTimeout(() => setVisible(true), 6000);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  // Never shown on Nara itself.
  if (pathname?.startsWith("/resources/nara")) return null;

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="group fixed bottom-5 right-5 z-[90] md:bottom-8 md:right-8"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <Link
            href="/resources/nara"
            aria-label="Use Nara, the HERdacity post builder"
            className="relative flex items-center gap-2.5 rounded-full bg-brand-pink py-3.5 pl-4 pr-5 text-white shadow-[0_10px_40px_-10px_rgba(246,16,103,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-charcoal hover:shadow-[0_14px_44px_-10px_rgba(43,45,32,0.5)] md:py-4 md:pl-5 md:pr-6"
          >
            <PenLine size={18} className="shrink-0" strokeWidth={2.25} />

            <span className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-tight md:text-base">
                Use Nara
              </span>
                <span className="text-xs font-medium tracking-tight md:text-sm">
                    Build your post with AI
                </span>
            </span>
          </Link>

          <button
            onClick={() => {
              setDismissed(true);
              try {
                sessionStorage.setItem(DISMISS_KEY, "1");
              } catch {
                // Nothing to do. It simply reappears on the next page.
              }
            }}
            aria-label="Hide this for now"
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-brand-charcoal/10 bg-white text-brand-charcoal/50 shadow-md transition-all hover:text-brand-pink md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}