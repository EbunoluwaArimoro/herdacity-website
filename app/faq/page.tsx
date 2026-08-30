"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/sections/PageHero"; // Consistent Dark Hero
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

// FAQ Data
const faqs = [
  {
    question: "What exactly is HERdacity?",
    answer: "HERdacity is more than just a community; it is a leadership ecosystem and professional growth network for ambitious women. We focus on wealth creation, high-level networking, and audacity in the workplace. We are the bridge between where you are and the C-Suite (or Founder status) you deserve."
  },
  {
    question: "Is there a membership fee?",
    answer: "We offer both open access resources and a tiered membership model. While our newsletter and public events are accessible to all, our core 'HER-Council' membership involves a commitment to ensure we cultivate a room of women who are serious about their growth."
  },
  {
    question: "How do I get matched with a Mentor?",
    answer: "Mentorship at HERdacity is not random. We use a matching system based on your current career stage, industry, and specific 'audacious goals' for the year. Mentorship cohorts open quarterly—join the waitlist to be notified when the next cycle begins."
  },
  {
    question: "I'm not in Tech. Can I still join?",
    answer: "Absolutely. While many of our members are in Tech, Product, and Digital sectors, the principles of audacious leadership, negotiation, and personal branding apply to every industry. If you are ambitious and ready to build, you belong here."
  },
//   {
//     question: "Do you have a Job Board?",
//     answer: "Yes. We partner with forward-thinking companies looking to hire female talent in leadership and technical roles. Exclusive opportunities are shared weekly in our private community channels before going public."
//   },
  {
    question: "What is your Refund Policy for paid events?",
    answer: "For masterclasses and workshops, tickets are non-refundable but are transferable up to 48 hours before the event. If you cannot attend, you can gift your seat to another woman in the community."
  },
  {
    question: "Where are the physical meetups held?",
    answer: "Our flagship physical gatherings are currently held in Lagos, Nigeria. We are actively working on expanding our footprint to other major cities across Nigeria soon, to ensure every woman in our ecosystem has access to the room."
  },
  {
    question: "Can I contribute or speak at an event?",
    answer: "We are always looking for voices that carry weight and wisdom. If you have a story of 'Audacious' career moves, a technical skill to teach, or a workshop idea, please reach out to us via the contact form or LinkedIn."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="bg-white min-h-screen">
      {/* 1. Consistent Dark Hero */}
      <PageHero 
        label="Support"
        title={
          <>
            Frequently Asked <span className="text-brand-pink font-serif italic">Questions</span>
          </>
        }
        subtitle="Everything you need to know about the sisterhood."
      />

      {/* 2. FAQ Accordion */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-brand-charcoal/10 rounded-2xl overflow-hidden bg-brand-off-white hover:border-brand-pink/30 transition-colors"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className={`text-lg md:text-xl font-bold ${openIndex === i ? 'text-brand-pink' : 'text-brand-charcoal'}`}>
                  {faq.question}
                </span>
                <span className="text-2xl font-light text-brand-charcoal/30">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-8 pt-0 text-brand-charcoal/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>


      <CTA />
      <Footer />
    </main>
  );
}