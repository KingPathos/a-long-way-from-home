import React from 'react';
import { motion } from 'motion/react';
import { Radio, Cpu, Flame, Infinity, Compass, Waves } from 'lucide-react';

export const Journey: React.FC = () => {
  const cards = [
    {
      id: 'source',
      badge: '1985',
      badgeColor: 'from-pink-500 to-rose-400',
      title: 'The source',
      body: 'Analog warmth, chrome, funk, synths, and the sound of possibility.',
      icon: Waves,
      coordinate: 'ORIGIN // DAYTON & CLEVELAND WAVES',
    },
    {
      id: 'foundation',
      badge: 'OHIO',
      badgeColor: 'from-amber-400 to-pink-500',
      title: 'The foundation',
      body: 'Independent spirit and the musical lineage that taught machines to groove.',
      icon: Flame,
      coordinate: 'GENETIC BLUEPRINT // GROOVE CODEX',
    },
    {
      id: 'destination',
      badge: '∞',
      badgeColor: 'from-cyan-400 to-fuchsia-500',
      title: 'The destination',
      body: 'A human story moving forward through the AI age without losing its soul.',
      icon: Infinity,
      coordinate: 'TRANSMISSION // FUTURE TIMELINE',
    },
  ];

  return (
    <section
      id="journey"
      className="relative py-28 px-4 sm:px-6 lg:px-12 bg-[#08080f] border-t border-b border-pink-500/10 overflow-hidden"
    >
      {/* Background Grids & Ambient Glows */}
      <div className="absolute inset-0 retro-grid-dense opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-xs font-mono-tech tracking-[0.3em] uppercase text-pink-400 mb-4">
            <span className="w-2 h-2 rounded-sm bg-pink-500" />
            <span>01 / THE JOURNEY</span>
          </div>

          {/* Kicker */}
          <p className="text-sm sm:text-base font-mono-tech text-cyan-400 uppercase tracking-widest mb-3">
            Not nostalgia. A transmission.
          </p>

          {/* Heading */}
          <h2
            id="journey-heading"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight uppercase mb-6"
          >
            Built in the past. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300">
              Arriving from the future.
            </span>
          </h2>

          {/* Body */}
          <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
            A Long Way From Home moves through memory, ambition, love, survival, and reinvention. The sound carries the DNA of an 80’s baby into a world reshaped by technology—fourteen records, one continuous journey.
          </p>
        </div>

        {/* Three Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.id}
                id={`timeline-card-${card.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative rounded-2xl bg-[#0d0d16]/90 border border-zinc-800/80 p-8 hover:border-pink-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:shadow-pink-950/30"
              >
                {/* Accent top glowing line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/40 group-hover:via-pink-400 to-transparent transition-all" />

                <div>
                  {/* Top Row: Badge & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono-tech font-bold tracking-widest uppercase text-white bg-gradient-to-r ${card.badgeColor} shadow-md`}
                    >
                      {card.badge}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-pink-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                    {card.title}
                  </h3>

                  {/* Card Body */}
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
                    {card.body}
                  </p>
                </div>

                {/* Card Footer Technical Coordinate */}
                <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                  <span className="truncate">{card.coordinate}</span>
                  <span className="text-pink-500 font-bold ml-2">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
