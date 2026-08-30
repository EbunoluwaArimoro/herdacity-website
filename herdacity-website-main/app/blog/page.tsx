"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero"; // Using the new consistent Dark Hero
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

// MOCK DATA
const posts = [
  {
    id: 1,
    title: "Why 'Nice' is Costing You Money: The Art of Negotiation",
    category: "Wealth",
    date: "Jan 12, 2026",
    excerpt: "We are taught to be grateful, but gratitude doesn't pay the bills. Here is how to audit your value and ask for the tax.",
    image: "/gallery-1.jpg", 
    slug: "why-nice-is-costing-you-money"
  },
  {
    id: 2,
    title: "Networking is a Love Language",
    category: "Connection",
    date: "Dec 28, 2025",
    excerpt: "Stop handing out business cards and start building alliances. The difference between a contact and a sponsor.",
    image: "/gallery-2.jpg",
    slug: "networking-is-a-love-language"
  },
  {
    id: 3,
    title: "The Pivot: Moving from Marketing to Tech Product Management",
    category: "Career",
    date: "Nov 15, 2025",
    excerpt: "You don't need to learn to code to work in tech. Here is the non-technical roadmap to a technical paycheck.",
    image: "/gallery-3.jpg",
    slug: "the-pivot-marketing-to-product"
  }
];

export default function BlogPage() {
  return (
    <main className="bg-white min-h-screen">
      
      {/* 1. Consistent Brand Hero */}
      <PageHero 
        label="The Journal"
        title={
          <>
            Insights & <span className="text-brand-pink font-serif italic">Strategies</span>
          </>
        }
        subtitle="Stories from the frontlines of female leadership, technology, and wealth creation."
        // Optional: Add image="/your-bg-image.jpg" here if you want a specific photo background
      />

      {/* Blog Grid */}
      <section className="py-24 px-6 bg-brand-off-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white text-brand-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="text-brand-charcoal/40 text-xs font-bold uppercase tracking-wider mb-3">
                    {post.date}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-brand-charcoal mb-4 leading-tight group-hover:text-brand-pink transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-brand-charcoal/60 text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-brand-pink border-b border-brand-pink pb-1"
                  >
                    Read Article 
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}