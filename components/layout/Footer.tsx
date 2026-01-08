"use client"; // Required for state
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail(""); // Clear input
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20 border-b border-white/10 pb-12">
          <div className="max-w-md">
            <h2 className="font-display font-bold text-3xl mb-4 tracking-tight">HERdacity</h2>
            <p className="text-white/60 leading-relaxed text-sm font-light">
              The community for women ready to lead in tech and beyond. <br/>
              We turn visibility into opportunity.
            </p>
          </div>
          
          {/* Functional ConvertKit Form */}
          <div className="w-full lg:w-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-white">Join the Newsletter</p>
            
            {status === "success" ? (
              <div className="bg-brand-pink/20 border border-brand-pink text-white px-6 py-3 rounded-lg text-sm">
                🎉 You're on the list! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-pink w-full md:w-64 transition-colors placeholder:text-white/20 disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="bg-brand-pink text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-white hover:text-brand-charcoal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
            )}
            
            {status === "error" && (
              <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/about" className="hover:text-brand-pink transition-colors">Our Story</Link></li>
              <li><Link href="/programs" className="hover:text-brand-pink transition-colors">Programs</Link></li>
              <li><Link href="/voices" className="hover:text-brand-pink transition-colors">Voices</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/events" className="hover:text-brand-pink transition-colors">Events</Link></li>
              <li><Link href="/blog" className="hover:text-brand-pink transition-colors">Insights</Link></li>
              <li><Link href="/faq" className="hover:text-brand-pink transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Socials</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="https://www.instagram.com/herdacity/" target="_blank" className="hover:text-brand-pink transition-colors">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/the-herdacity-network/" target="_blank" className="hover:text-brand-pink transition-colors">LinkedIn</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=61585711823791" target="_blank" className="hover:text-brand-pink transition-colors">Facebook</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="max-w-full overflow-hidden">
                <a 
                  href="mailto:theherdacitynetwork@gmail.com" 
                  className="hover:text-brand-pink transition-colors block break-words"
                >
                  theherdacitynetwork@gmail.com
                </a>
              </li>
              <li><span className="opacity-50">Lagos, Nigeria</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-white/30 text-xs">
          <p>© 2026 The HERdacity Network. Built with audacity.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}