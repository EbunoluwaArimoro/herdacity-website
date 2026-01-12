"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  // Updated state to hold all new fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    jobTitle: "",
    company: ""
  });
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
        // Reset form
        setFormData({ 
          firstName: "", lastName: "", email: "", 
          phone: "", linkedin: "", jobTitle: "", company: "" 
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            // Added max-height and overflow for scrolling on smaller screens
            className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 rounded-3xl shadow-2xl z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-brand-pink hover:text-white transition-colors font-bold z-20"
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
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-display font-bold text-brand-charcoal mt-2 mb-2">
                    Join HERdacity
                  </h3>
                  <p className="text-brand-charcoal/60 text-sm leading-relaxed">
                    Join our network of ambitious women building the future.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Fields - 2 Columns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-1">First Name *</label>
                      <input 
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-1">Last Name *</label>
                      <input 
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  {/* Contact Fields - 2 Columns on MD screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-1">Email *</label>
                      <input 
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-1">Phone *</label>
                      <input 
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                        placeholder="+234..."
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-1">LinkedIn URL</label>
                    <input 
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  {/* Professional Fields - 2 Columns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-1">Job Title</label>
                      <input 
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                        placeholder="Product Manager"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 mb-1">Company</label>
                      <input 
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-brand-off-white border border-brand-charcoal/10 rounded-xl px-4 py-3 text-brand-charcoal focus:outline-none focus:border-brand-pink transition-colors text-sm"
                        placeholder="Tech Corp"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-brand-pink text-white font-bold py-4 rounded-xl hover:bg-[#d60e59] transition-all shadow-lg shadow-brand-pink/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm uppercase tracking-wide"
                  >
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