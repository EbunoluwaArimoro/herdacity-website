"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const tracks = [
  {
    title: "No-Code & Automation",
    desc: "Stop doing busy work. Learn to build internal tools, automate workflows, and scale operations using tools like Zapier and Airtable.",
    image: "/Pathways-1.png", 
  },
  {
    title: "Product & UI/UX Design",
    desc: "Learn to design intuitive digital products. From wireframing to high-fidelity prototyping, master the skills to build user-centric interfaces.",
    image: "/Pathways-2.png", 
  },
  {
    title: "Digital Marketing",
    desc: "Master the art of visibility. From LinkedIn personal branding to strategic content creation that converts attention into opportunity.",
    image: "/Pathways-3.png",
  },
  {
    title: "AI & Productivity",
    desc: "Future-proof your career. Learn to integrate AI tools into your daily workflow to solve problems faster and smarter.",
    image: "/Pathways-4.png",
  }
];

export default function Curriculum() {
  return (
    <section className="py-24 bg-[#faf9f6] border-b border-brand-charcoal/5">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-display font-bold text-brand-charcoal mb-8">
            Core Tracks
          </h2>
          
          <div className="w-16 h-1 bg-brand-charcoal/10 mx-auto rounded-full mb-8"></div>
          
          <p className="text-xl text-brand-charcoal/70 font-light leading-relaxed">
             Practical skills for the modern tech ecosystem.
          </p>
        </div>

        {/* 4-Card Grid (Exact structure from Pathways) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-brand-charcoal/5 hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Area */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              
              {/* Text Area */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-brand-charcoal mb-3 group-hover:text-brand-pink transition-colors">
                  {item.title}
                </h3>
                <p className="text-brand-charcoal/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}