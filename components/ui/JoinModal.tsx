"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-brand-pink hover:text-white transition-colors font-bold"
            >
              ✕
            </button>

            {status === "success" ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-pink text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-charcoal mb-2">Welcome Home.</h3>
                <p className="text-brand-charcoal/60 text-sm">You've officially joined the sisterhood. Please check your inbox to confirm your subscription.</p>
                <button onClick={onClose} className="mt-8 text-brand-pink font-bold text-sm uppercase tracking-widest border-b border-brand-pink pb-1 hover:text-brand-charcoal hover:border-brand-charcoal transition-all">Close Window</button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  {/* Removed "The Community" label */}
                  <h3 className="text-2xl font-display font-bold text-brand-charcoal mt-2 mb-2">
                    Join HERdacity
                  </h3>
                  <p className="text-brand-charcoal/60 text-sm leading-relaxed">
                    Access masterclasses, accountability, and a network of ambitious women.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-2">First Name</label>
                      <input 
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-2">Last Name</label>
                      <input 
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-2">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-brand-pink text-white font-bold py-4 rounded-xl hover:bg-[#d60e59] transition-all shadow-lg shadow-brand-pink/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm uppercase tracking-wide"
                  >
                    {/* Changed Text */}
                    {status === "loading" ? "Joining..." : "Join the Network"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}