"use client";

import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import Image from "next/image";

const items = [
  { id: 1, src: "/events-hero.png" },
  { id: 5, src: "/gallery-4.jpg" },
  { id: 4, src: "/gallery-3.jpg" },
  { id: 8, src: "/gallery-2.jpg" },
  { id: 3, src: "/HER pic home.jpg" },
  { id: 7, src: "/gallery-6.jpg" },
  { id: 2, src: "/gallery-1.jpg" },
//   { id: 6, src: "/gallery-5.jpg" },
//   { id: 8, src: "/gallery-7.jpg" },
];

export default function VisualManifesto() {
  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <section className="py-24 bg-white selection:bg-brand-pink">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-brand-pink"></div>
            <h3 className="text-brand-charcoal font-bold uppercase tracking-[0.2em] text-xs">
              Our Favorite moments
            </h3>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-charcoal leading-[1.1]">
           Stories in <br className="md:hidden" />
            <span className="text-brand-pink italic font-serif">Frames</span>
          </h2>
        </div>

        {/* Masonry with plain CSS classes */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <div className="relative overflow-hidden group bg-brand-off-white shadow-sm transition-all duration-700">
                <Image
                  src={item.src}
                  alt="HERdacity Community"
                  width={800}
                  height={1200}
                  className="w-full h-auto object-cover transition-all duration-[1.5s] ease-out group-hover:grayscale-0 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i < 3}
                />
                <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </Masonry>

        {/* Kinetic scroll button */}
        <div className="mt-32 flex flex-col items-center">
          <button 
            onClick={() => {
              const agenda = document.getElementById('agenda-section');
              agenda?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-6 group border-none bg-transparent outline-none cursor-pointer"
          >
          </button>
        </div>
      </div>
    </section>
  );
}