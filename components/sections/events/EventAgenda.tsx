"use client";

import { motion } from "framer-motion";
import Link from "next/link"; 

// Helper to check if an event has passed
const isEventPast = (dateString: string) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  // Reset time to ensure we compare only dates (ignores time of day)
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};

const allEvents = [
  // --- Q1: The Foundation ---
  {
    id: "jan-2026",
    sortDate: "2026-01-28", 
    displayDate: "Jan 28",
    title: "Price Your Genius",
    category: "Workshop",
    description: "The Audacious Guide to Salary Negotiation & Side Hustle Scalability.",
    status: "Open",
    link: "https://luma.com/qdgrouzm" 
  },
  {
    id: "feb-2026",
    sortDate: "2026-02-11",
    displayDate: "Feb 11",
    title: "Networking is a Love Language",
    category: "Masterclass",
    description: "Building Strategic Alliances in Tech & Beyond.",
    status: "Open",
    link: "https://luma.com/moiykgcg"
  },
  {
    id: "mar-2026",
    sortDate: "2026-03-08",
    displayDate: "Mar 08",
    title: "Show Up Audaciously",
    category: "Workshop",
    description: "Leveraging #GiveToGain to build a personal brand that serves and sells.",
    status: "Open",
    link: "https://luma.com/4lczxmsj"
  },

  // --- Q2: The Acceleration ---
  {
    id: "apr-2026",
    sortDate: "2026-04-04",
    displayDate: "Apr 04",
    title: "AI for the Rest of Us",
    category: "Workshop",
    description: "5 No-Code Tools to Automate Your Career Growth.",
    status: "Open",
    link: "https://luma.com/jp4683ds"
  },
  {
    id: "may-2026",
    sortDate: "2026-05-01",
    displayDate: "May 01",
    title: "The Burnout Breakthrough",
    category: "Wellness",
    description: "High Performance Without the Crash.",
    status: "Open",
    link: "https://luma.com/ehe9ydqa"
  },
  {
    id: "jun-2026",
    sortDate: "2026-06-23",
    displayDate: "Jun 23",
    title: "The Art of the Pivot",
    category: "Masterclass",
    description: "How to Transfer Your Skills into a High-Growth Industry.",
    status: "Open",
    link: "https://luma.com/91z7fzex"
  },

  // --- Q3: The Expansion ---
  {
    id: "jul-2026",
    sortDate: "2026-07-15",
    displayDate: "Jul 15",
    title: "Speak Like a C-Suite Exec",
    category: "Workshop",
    description: "Mastering Persuasion in Boardrooms.",
    status: "Open",
    link: "https://luma.com/oh9n2ejk"
  },
  {
    id: "aug-2026",
    sortDate: "2026-08-26",
    displayDate: "Aug 26",
    title: "Office Politics 101",
    category: "Strategy",
    description: "Navigating Bias and Advocating for Yourself and Others.",
    status: "Open",
    link: "https://luma.com/vjeu31ma"
  },
  {
    id: "sep-2026",
    sortDate: "2026-09-30",
    displayDate: "Sep 30",
    title: "From Employee to Thought Leader",
    category: "Workshop",
    description: "Launching Your Industry Newsletter/Podcast.",
    status: "Open",
    link: "https://luma.com/ay6m960j"
  },

  // --- Q4: The Harvest ---
  {
    id: "oct-2026",
    sortDate: "2026-10-11",
    displayDate: "Oct 11",
    title: "Protect Your Brand",
    category: "Strategy",
    description: "Digital Hygiene and Crisis Management for Leaders.",
    status: "Open",
    link: "https://luma.com/qtusrz55"
  },
  {
    id: "nov-2026",
    sortDate: "2026-11-19",
    displayDate: "Nov 19",
    title: "The CEO Mindset",
    category: "Masterclass",
    description: "How to Run Your Career Like a Business.",
    status: "Open",
    link: "https://luma.com/xzklxmsj"
  },
  {
    id: "dec-2026",
    sortDate: "2026-12-12",
    displayDate: "Dec 12",
    title: "Becoming Her 26",
    category: "Flagship",
    description: "The Unveiling: Celebrating the Woman You Evolved Into.",
    status: "Waitlist",
    link: "https://luma.com/o4t8x60x"
  }
];

export default function EventAgenda() {
  // 1. Filter out past events
  // 2. Slice to take only the first 3
  const upcomingEvents = allEvents
    .filter(event => !isEventPast(event.sortDate))
    .slice(0, 3);

  return (
    <section className="-mt-24 py-24 bg-[#f7f7f9] min-h-[50vh]">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-brand-charcoal">
              Upcoming Events
            </h2>
            <div className="w-12 h-1 bg-brand-charcoal/10 mt-6 rounded-full"></div>
          </div>

          <div className="flex flex-col">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-brand-charcoal/10 last:border-none hover:border-brand-pink transition-colors duration-300 cursor-default"
                >
                  {/* Date & Category */}
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <span className="block text-brand-pink font-serif italic text-2xl mb-1">{event.displayDate}</span>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40 border border-brand-charcoal/10 px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="md:w-1/2 mb-6 md:mb-0 pr-8">
                    <h3 className="text-2xl font-bold text-brand-charcoal group-hover:text-brand-pink transition-colors mb-2">
                      {event.title}
                    </h3>
                    <p className="text-brand-charcoal/60 text-base font-light leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="md:w-1/4 flex md:justify-end items-center">
                    {event.status === "Open" ? (
                      <Link 
                        href={event.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <button className="bg-brand-charcoal text-white px-10 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-brand-pink transition-all duration-300 ease-in-out shadow-sm active:scale-95">
                          Register
                        </button>
                      </Link>
                    ) : (
                      // If status is NOT Open (e.g. Waitlist), button is disabled but we still wrap it in Link if you want them to sign up for waitlist.
                      // If you want "Waitlist" events to be clickable, use the Link wrapper. 
                      // Below is the clickable version for Waitlist too:
                      <Link 
                        href={event.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                         <button className="bg-neutral-200 text-brand-charcoal/50 px-10 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] border border-brand-charcoal/5 hover:bg-brand-pink hover:text-white transition-all duration-300">
                          {event.status}
                        </button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center text-brand-charcoal/50">
                <p className="text-lg">No upcoming events scheduled at the moment.</p>
                <p className="text-sm mt-2">Check back soon for our 2027 roadmap.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}