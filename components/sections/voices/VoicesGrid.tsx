"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const voices = [
  {
    name: "Mariam Yusuf",
    image: "/mariam.jpg", // Restored your change
    story: "HERdacity has been so impactful for me because it creates a space where my “ambitiousness” does not have to be masked or softened. It has been a community that has reminded me that I don’t have to figure everything out alone on my journey to reaching my full potential and I’m so grateful for this sisterhood!",
    role: "Member"
  },
  {
    name: "Alice Arimoro",
    image: "/alice.jpg", // Restored your change
    story: "After joining HERdacity, what changed for me was the sense of grounding and clarity I felt in my personal and professional goals. What started as a space to build a personal brand on LinkedIn evolved into something much deeper and more meaningful. The community supported my growth by creating a safe, intimate environment where I could be vulnerable without judgement, ask honest questions, and receive genuine support from women who truly understand the challenges of building a career and a life. Today, HERdacity means safety, alignment, and sisterhood. It’s a space where I feel held while figuring things out and supported as I grow into the woman I’m becoming.",
    role: "Member"
  },
  {
    name: "Christianah Arowolo",
    image: "/christianah.jpg", // Restored your change
    story: "Meeting real women, solving real problems and figuring it out completely changed my perspective about female focused communities. HERdacity has supported my growth through our weekly meet-ups which tackles unspoken challenges for women in the work and business place. Those tips including visualization exercises has helped me build better goal structures. To me, HERdacity means three words which are support, momentum, and motivation.",
    role: "Member"
  },
  {
    name: "Viola Echere",
    image: "/viola.jpg", // Restored your change
    story: "HERdacity created that opportunity to meet women like me who are also on similar paths so I would say, feeling safe enough to share. Understanding that as a woman I am not alone in this journey of self growth and development. This community has supported my growth through the weekly sessions which has been quite insightful. Having each member of the group share their thoughts and even experiences during these sessions has been eye opening. I have also had the experience to share mine. It has generally been a great opportunity and a learning curve. HERdacity to me means sisterhood, family, and girlpower.",
    role: "Member"
  },
  {
    name: "Modupe Laosun",
    image: "/modupe.jpg", // Restored your change
    story: "I gained clarity and confidence after joining HERdacity. Being around women who are also building and figuring things out reminded me that I’m not alone and that my journey is valid. This community has supported my growth through shared experiences, conversations, and encouragement. Seeing other women show up, learn, and push despite challenges motivated me to keep going even on days I doubted myself. HERdacity feels like a safe space to grow, learn, and become. It’s a room where women support each other, show up as they are, and keep pushing towards better.",
    role: "Member"
  },
  {
    name: "Feyi Akinyeye",
    image: "/feyi.jpg", // Restored your change
    story: "After joining HERdacity, I learned the power of showing up. How consistency actually works, how results compound over time, and how team bonding plays a huge role in growth. Just being present consistently has shifted a lot for me. The weekly learning has been huge for me. It feels like subscribing to constant growth without pressure. Our speakers share real experiences and practical insights, and for someone like me who learns best through conversations, that’s priceless. Those weekly sessions has contributed a lot to how I think, show up, and grow. As regards what HERdacity means to me, if I’m being honest, I’m still finding the words for it. But HERdacity represents possibility. Seeing how it started and watching women actively build, learn, and show up for themselves reminds me that growth does not have to be lonely. It’s a space that’s still evolving, and being part of that journey matters to me.",
    role: "Member"
  }
];

export default function VoicesGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Featured Voices Section Header */}
        <div className="flex items-center gap-8 mb-24">
          <div className="h-[1.5px] flex-1 bg-brand-pink opacity-30"></div>
          {/* Added font-display here for brand consistency */}
          <h3 className="text-brand-pink font-display font-bold uppercase tracking-[0.3em] text-sm whitespace-nowrap">
            Featured voices
          </h3>
          <div className="h-[1.5px] flex-1 bg-brand-pink opacity-30"></div>
        </div>

        <div className="flex flex-col gap-32">
          {voices.map((voice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[15px] shadow-2xl">
                  <Image
                    src={voice.image}
                    alt={voice.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 flex flex-col gap-6">
                <div className="inline-block">
                  {/* Added font-display here */}
                  <h4 className="text-2xl font-display font-bold text-brand-charcoal uppercase tracking-widest inline-block border-b-2 border-brand-pink pb-1">
                    {voice.name}
                  </h4>
                  <p className="text-[10px] text-brand-charcoal/40 uppercase tracking-[0.4em] mt-3 font-bold">
                    {voice.role}
                  </p>
                </div>
                
                {/* DECORATIVE QUOTE SECTION */}
                <div className="relative pt-2">
                  <span className="absolute -top-6 -left-4 text-8xl text-brand-pink/20 font-serif font-bold italic leading-none select-none">
                    “
                  </span>
                  {/* Changed font-medium to font-light & italic for elegance */}
                  <p className="relative z-10 text-xl md:text-2xl text-brand-charcoal/80 font-light leading-relaxed font-sans italic">
                    {voice.story}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}