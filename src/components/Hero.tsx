import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, ChevronDown, Sparkles, Disc, Radio } from 'lucide-react';
import { Track } from '../types';

interface HeroProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number, autoPlay?: boolean) => void;
}

export const Hero: React.FC<HeroProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [isZooming, setIsZooming] = useState(false);

  const activeTrack = tracks[currentTrackIndex] || tracks[0];

  const handleEnterExperience = () => {
    setIsZooming(true);
    setTimeout(() => {
      setIsZooming(false);
      const target = document.getElementById('journey') || document.getElementById('album');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 450);
  };

  // Six key orbit tracks for the hero ellipse
  const orbitTrackIndices = [0, 1, 2, 3, 4, 5];

  // Elliptical coordinate helper for 6 points around an ellipse
  // a = radiusX, b = radiusY
  const getEllipsePoint = (index: number, total: number) => {
    // Offset angle so point 1 starts at top/top-right
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const rx = 140; // width radius
    const ry = 80; // height radius
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    return { x, y, angle };
  };

  return (
    <section
      id="hero-section"
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-12 transition-transform duration-700 ${
        isZooming ? 'scale-[1.03]' : 'scale-100'
      }`}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {imageLoaded && (
          <img
            src="/hero-album-match.png"
            alt="A Long Way From Home - Album Background"
            onError={() => setImageLoaded(false)}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Fallback Retro-Futuristic Cosmic Synth Landscape if image is absent */}
        {!imageLoaded && (
          <div className="w-full h-full bg-[#06060a] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#06060a] via-[#160b24] to-[#041226]" />
            <div className="absolute -top-40 right-10 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 retro-grid opacity-30" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#06060a] to-transparent" />
          </div>
        )}
      </div>

      {/* Dark gradient overlay for crisp text readability while preserving the artwork */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06060a]/90 via-[#06060a]/60 to-transparent pointer-events-none" />
      
      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-40 -z-10 bg-gradient-to-t from-[#06060a] via-[#06060a]/70 to-transparent pointer-events-none" />

      {/* Hero Content Grid */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Typography and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950/40 border border-pink-500/30 text-pink-300 text-xs font-mono-tech uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
              <span>Past made me • Present drives me • Future awaits me</span>
            </div>

            {/* Main Title on Two Lines with exact typography specifications */}
            <h1
              id="hero-main-title"
              className="font-hero-title uppercase text-white mb-6 drop-shadow-2xl"
              style={{
                fontFamily: '"Times New Roman", Georgia, serif',
                fontWeight: 400,
                fontSize: 'clamp(72px, 8.1vw, 132px)',
                lineHeight: 0.78,
                letterSpacing: '-0.065em',
              }}
            >
              <span className="block text-white">
                A LONG WAY
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-400 to-cyan-400">
                FROM HOME
              </span>
            </h1>

            {/* Supporting Line */}
            <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 font-light tracking-wide max-w-xl mb-10 leading-relaxed">
              An 80’s soul moving through the AI age.
            </p>

            {/* Pill-shaped gradient-border button */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                id="hero-enter-experience-btn"
                type="button"
                onClick={handleEnterExperience}
                className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-mono-tech uppercase tracking-[0.25em] text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-black cursor-pointer shadow-lg shadow-pink-500/20"
              >
                {/* Gradient Border Background */}
                <span className="absolute inset-0 rounded-full p-[1.5px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 group-hover:from-pink-400 group-hover:to-cyan-300 transition-all">
                  <span className="block w-full h-full rounded-full bg-[#0d0914] group-hover:bg-[#150e20] transition-colors" />
                </span>
                
                {/* Button Content */}
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200 group-hover:to-white">
                  Enter the experience
                </span>
                <span className="relative z-10 text-pink-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              <a
                href="#album"
                id="hero-quick-listen-btn"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-xs font-mono-tech uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-all backdrop-blur-sm"
              >
                <Disc className="w-4 h-4 text-cyan-400" />
                <span>Fourteen Records</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Elliptical Neon Orbit Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative mt-6 lg:mt-0"
          >
            <div className="w-full max-w-[380px] sm:max-w-[420px] aspect-[4/3] relative flex items-center justify-center">
              
              {/* Elliptical Glow Base */}
              <div className="absolute inset-0 bg-radial from-pink-500/10 via-cyan-500/5 to-transparent rounded-full filter blur-2xl pointer-events-none" />

              {/* Elliptical Orbit Track SVG Ring */}
              <svg
                viewBox="0 0 360 220"
                className="w-full h-full overflow-visible pointer-events-none absolute inset-0"
              >
                <defs>
                  <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff2d87" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#8a2be2" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <ellipse
                  cx="180"
                  cy="110"
                  rx="140"
                  ry="75"
                  fill="none"
                  stroke="url(#orbit-grad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="opacity-70 animate-pulse"
                />
              </svg>

              {/* Center Pill: Selected Track Name & Status */}
              <div
                id="hero-orbit-center-pill"
                className="z-20 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#0c0a14]/90 border border-pink-500/40 backdrop-blur-md shadow-2xl shadow-pink-950/60 max-w-[200px]"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono-tech uppercase tracking-widest text-pink-400 mb-1">
                  {isPlaying ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                      <span>Transmitting</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                      <span>Ready</span>
                    </>
                  )}
                </div>
                <div className="font-editorial text-sm font-bold text-white line-clamp-1">
                  {activeTrack.title}
                </div>
                <div className="text-[10px] font-mono-tech text-zinc-400 tracking-wider line-clamp-1 mt-0.5">
                  {activeTrack.signalPhrase}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTrack(currentTrackIndex, !isPlaying)}
                  className="mt-2.5 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/50 hover:scale-110 active:scale-95 transition-all focus:outline-none"
                  aria-label={isPlaying ? 'Pause active track' : 'Play active track'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              </div>

              {/* 6 Numbered Clickable Nodes Around the Orbit */}
              {orbitTrackIndices.map((trackIdx, i) => {
                const { x, y } = getEllipsePoint(i, orbitTrackIndices.length);
                const track = tracks[trackIdx];
                const isCurrent = currentTrackIndex === trackIdx;

                return (
                  <button
                    key={track.id}
                    id={`hero-orbit-node-${track.trackNumber}`}
                    type="button"
                    onClick={() => onSelectTrack(trackIdx, true)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className={`absolute z-30 group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 focus:outline-none ${
                      isCurrent
                        ? 'bg-pink-500 text-white scale-125 glow-pink-md ring-2 ring-white/80'
                        : 'bg-zinc-900/90 text-zinc-300 border border-pink-500/40 hover:border-cyan-400 hover:text-white hover:scale-110'
                    }`}
                    aria-label={`Select Track 0${track.trackNumber}: ${track.title}`}
                    title={`0${track.trackNumber}. ${track.title} — ${track.signalPhrase}`}
                  >
                    <span className="font-mono-tech text-xs font-bold">
                      {track.trackNumber}
                    </span>

                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap bg-zinc-950/95 border border-pink-500/40 px-2.5 py-1 rounded text-[10px] font-mono-tech text-zinc-200 z-40 shadow-xl">
                      <span className="text-pink-400 font-semibold">0{track.trackNumber}</span> {track.title}
                    </div>
                  </button>
                );
              })}

            </div>
          </motion.div>

        </div>
      </div>

      {/* Hero Bottom Bar: Scroll to travel (lower-left) & Transmission signal stats */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 pt-4 border-t border-zinc-900/60">
        <a
          href="#journey"
          id="scroll-to-travel-link"
          className="inline-flex items-center gap-2.5 text-xs font-mono-tech tracking-[0.2em] uppercase text-zinc-400 hover:text-pink-400 transition-colors focus:outline-none group"
        >
          <ChevronDown className="w-4 h-4 text-pink-500 group-hover:translate-y-1 transition-transform animate-bounce" />
          <span>Scroll to travel</span>
        </a>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono-tech text-zinc-400">
          <span>ORIGIN: <strong className="text-zinc-200">1985</strong></span>
          <span className="text-zinc-600">•</span>
          <span>FREQUENCY: <strong className="text-cyan-400">OHIO FUNK DNA</strong></span>
          <span className="text-zinc-600">•</span>
          <span>SIGNAL: <strong className="text-pink-400">ACTIVE</strong></span>
        </div>
      </div>
    </section>
  );
};
