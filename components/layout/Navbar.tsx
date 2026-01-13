"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Added to check current page
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/context/ModalContext"; 

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openModal } = useModal(); 
  const pathname = usePathname();

  // Pages that need a dark navbar (visible text) by default because they have light backgrounds
  const forceDarkNavPaths = ["/privacy", "/terms", "/blog", "/faq"];
  const isDarkNav = forceDarkNavPaths.includes(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [mobileMenuOpen]);

  // Determine if we should show the "Scrolled/Dark" style
  const showDarkStyle = scrolled || mobileMenuOpen || isDarkNav;

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          showDarkStyle
            ? "bg-white/95 backdrop-blur-xl border-b border-brand-charcoal/5 h-20"
            : "bg-transparent h-24"
        }`}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <div className="relative w-8 h-8">
              <Image 
                src={showDarkStyle ? "/icon.png" : "/icon-white.png"} 
                alt="Icon" 
                fill
                className="object-contain"
              />
            </div>
            <span className={`-ml-1.5 font-display font-bold text-xl tracking-tight leading-none ${
              showDarkStyle ? "text-brand-charcoal" : "text-white"
            }`}>
              HERdacity
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {['About', 'Programs', 'Events', 'Voices'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Blog' || item === 'FAQ' ? `/${item.toLowerCase()}` : `/${item.toLowerCase()}`} 
                className={`text-sm font-medium transition-colors ${
                  showDarkStyle ? "text-brand-charcoal hover:text-brand-pink" : "text-white hover:text-white/80"
                }`}
              >
                {item}
              </Link>
            ))}
            
            <button onClick={openModal} className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${ showDarkStyle ? "bg-brand-charcoal text-white hover:bg-brand-pink" : "bg-white text-brand-charcoal hover:bg-brand-pink hover:text-white hover:scale-105 hover:shadow-lg" }`} > 
              Join Us
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden z-50 p-2"
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2 bg-brand-charcoal" : showDarkStyle ? "bg-brand-charcoal" : "bg-white"}`}></span>
              <span className={`block w-6 h-0.5 transition-all ${mobileMenuOpen ? "opacity-0" : showDarkStyle ? "bg-brand-charcoal" : "bg-white"}`}></span>
              <span className={`block w-6 h-0.5 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2 bg-brand-charcoal" : showDarkStyle ? "bg-brand-charcoal" : "bg-white"}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white pt-32 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {['About', 'Programs', 'Events', 'Voices'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-display font-bold text-brand-charcoal hover:text-brand-pink"
                >
                  {item}
                </Link>
              ))}
              <hr className="border-gray-100 w-full" />
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal();
                }}
                className="bg-brand-pink text-white py-4 rounded-xl text-lg font-bold w-full"
              >
                Join the Network
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}