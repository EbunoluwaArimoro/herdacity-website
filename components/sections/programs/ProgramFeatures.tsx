"use client";
import { motion } from "framer-motion";

const features = [
  {
    title: "Lifetime Access",
    desc: "Revisit the material whenever you need a refresh. Expiring content is not our vibe.",
    path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
  },
  {
    title: "Portfolio Ready",
    desc: "Every course ends with a finished project you can immediately showcase to recruiters.",
    path: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  },
  {
    title: "Verified Certificate",
    desc: "Earn a credential that validates your skills and can be added directly to your LinkedIn profile.",
    path: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
  },
  {
    title: "Expert Feedback",
    desc: "Don't just watch videos. Get feedback on your capstone projects from industry mentors.",
    path: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
  }
];

export default function ProgramFeatures() {
  
  // Helper to determine exact border classes for the matrix
  const getBorderClasses = (i: number) => {
    // Base color
    let classes = "border-brand-charcoal/10 ";
    
    // MOBILE: Add bottom border to first 3 items (0, 1, 2)
    if (i < 3) classes += "border-b ";

    // DESKTOP: Specific Matrix Logic (2 columns)
    // Item 0 (Top Left): Needs Right + Bottom
    if (i === 0) classes += "md:border-r md:border-b ";
    
    // Item 1 (Top Right): Needs Bottom only (Mobile added it, we keep it. Ensure no Right)
    if (i === 1) classes += "md:border-r-0 md:border-b ";
    
    // Item 2 (Bottom Left): Needs Right only (Remove Mobile Bottom)
    if (i === 2) classes += "md:border-r md:border-b-0 ";
    
    // Item 3 (Bottom Right): Needs None (Mobile didn't add bottom, so we are good)
    if (i === 3) classes += "md:border-none ";

    return classes;
  };

  return (
    <section className="py-24 bg-white border-t border-brand-charcoal/5">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-display font-bold text-brand-charcoal mb-8">
            Included in Every Track
          </h2>
          
          <div className="w-16 h-1 bg-brand-charcoal/10 mx-auto rounded-full mb-8"></div>
          
          <p className="text-xl text-brand-charcoal/70 font-light leading-relaxed">
             We handle the logistics so you can focus on the learning.
          </p>
        </div>

        {/* MATRIX LAYOUT */}
{/* MATRIX LAYOUT - GRID GAP METHOD */}
{/* MATRIX LAYOUT - GRID GAP METHOD */}
<div className="rounded-3xl border border-brand-charcoal/10 overflow-hidden">
  <div className="grid grid-cols-1 md:grid-cols-2">
    
    {features.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className={`
          group p-10 md:p-14 bg-white hover:bg-[#faf9f6] transition-colors duration-300 flex items-start gap-6
          /* Add thin border to the bottom of all items */
          border-b border-brand-charcoal/10 
          /* On desktop, add a right border only to the left column (odd items) */
          ${i % 2 === 0 ? 'md:border-r' : ''}
          /* Remove bottom border on the very last items so it doesn't double-up with the container */
          ${i >= features.length - 2 ? 'md:border-b-0' : ''}
          ${i === features.length - 1 ? 'border-b-0' : ''}
        `}
      >
        {/* Icon */}
        <div className="shrink-0 p-3 rounded-lg bg-brand-pink/5 text-brand-pink group-hover:scale-110 transition-transform duration-300">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d={item.path} />
          </svg>
        </div>

        {/* Text Content */}
        <div>
          <h3 className="text-xl font-bold text-brand-charcoal mb-2">
            {item.title}
          </h3>
          <p className="text-brand-charcoal/70 leading-relaxed font-light">
            {item.desc}
          </p>
        </div>
      </motion.div>
    ))}

  </div>
</div>

      </div>
    </section>
  );
}