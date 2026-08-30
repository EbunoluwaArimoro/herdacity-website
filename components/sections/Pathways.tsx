"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const pathways = [
  {
    title: "Early-Career Women",
    desc: "Building the foundational confidence to navigate tech spaces and be seen from day one.",
    image: "/Pathways-1.png", 
  },
  {
    title: "Career Switchers",
    desc: "Finding clarity and translating your existing value into a new tech reality.",
    image: "/Pathways-2.png",
  },
  {
    title: "Growth Navigators",
    desc: "For those already in the room but ready to take up more space and own the table.",
    image: "/Pathways-3.png", 
  },
  {
    title: "The Community",
    desc: "A safe space to ask the hard questions, share wins, and grow without judgement.",
    image: "/Pathways-4.png",
  }
];

export default function Pathways() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Header with Visual Break */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-display font-bold text-brand-charcoal mb-8">
            Who HERdacity is For
          </h2>
          
          <div className="w-16 h-1 bg-brand-charcoal/10 mx-auto rounded-full mb-8"></div>
          
          <p className="text-xl text-brand-charcoal/70 font-light leading-relaxed">
           We don't do generic "empowerment."<br /> 
           We build specific support structures for distinct stages of your journey.
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathways.map((item, i) => (
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
                  // CHECK: If index is 2 (3rd card), keep it centered. Otherwise, align to top.
                  className={`object-cover group-hover:scale-105 transition-transform duration-700 ${i === 2 ? 'object-center' : 'object-top'}`}
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