import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Radio, Send, ArrowUp, Disc3, Sparkles, ExternalLink, Headphones } from 'lucide-react';

export const SignalSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const platforms = [
    { name: 'Spotify', url: 'https://open.spotify.com', color: 'hover:text-[#1DB954] hover:border-[#1DB954]/50' },
    { name: 'Apple Music', url: 'https://music.apple.com', color: 'hover:text-[#FA243C] hover:border-[#FA243C]/50' },
    { name: 'YouTube Music', url: 'https://music.youtube.com', color: 'hover:text-[#FF0000] hover:border-[#FF0000]/50' },
    { name: 'Tidal', url: 'https://tidal.com', color: 'hover:text-cyan-400 hover:border-cyan-400/50' },
    { name: 'Amazon Music', url: 'https://music.amazon.com', color: 'hover:text-amber-400 hover:border-amber-400/50' },
    { name: 'SoundCloud', url: 'https://soundcloud.com', color: 'hover:text-[#FF5500] hover:border-[#FF5500]/50' },
  ];

  return (
    <section
      id="signal"
      className="relative py-28 px-4 sm:px-6 lg:px-12 bg-[#08070e] overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 retro-grid-dense opacity-15 pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-xs font-mono-tech tracking-[0.3em] uppercase text-pink-400 mb-4">
            <span className="w-2 h-2 rounded-sm bg-pink-500" />
            <span>03 / THE SIGNAL</span>
          </div>

          {/* Kicker */}
          <p className="text-sm sm:text-base font-mono-tech text-cyan-400 uppercase tracking-widest mb-3">
            Broadcast & Connection
          </p>

          {/* Heading */}
          <h2
            id="signal-heading"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight uppercase mb-6"
          >
            Stay tuned to the frequency.
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            The transmission continues across all major streaming channels and direct frequency dispatches. Connect with DARRIK and stream the full album experience anywhere.
          </p>
        </div>

        {/* Content Grid: Streaming Hub & Frequency Dispatch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* Streaming Platforms Card */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0e0c18]/90 border border-zinc-800 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-xs font-mono-tech uppercase tracking-widest text-pink-400">
                <Headphones className="w-4 h-4 text-pink-500" />
                <span>Global Streaming Links</span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-white mb-2">
                Available Across All Networks
              </h3>
              <p className="text-sm text-zinc-400 mb-6 font-light">
                High-fidelity 24-bit master audio streams available on your preferred music service.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono-tech uppercase tracking-wider text-zinc-300 transition-all ${platform.color} group`}
                >
                  <span>{platform.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Frequency Dispatch / Transmission Subscription Card */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0e0c18]/90 border border-pink-500/30 p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-4 text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Direct Satellite Link</span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-white mb-2">
                Join the Private Transmission
              </h3>
              <p className="text-sm text-zinc-400 mb-6 font-light">
                Receive unreleased live recordings, behind-the-scenes studio sessions, tour dates, and exclusive merchandise drops.
              </p>
            </div>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-pink-500/20 border border-pink-500/50 text-pink-300 text-xs font-mono-tech tracking-wider flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                <span>SIGNAL LOCKED. You are now subscribed to DARRIK transmissions.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  id="transmission-email-input"
                  type="email"
                  required
                  placeholder="Enter your transmission coordinates (email)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors font-mono-tech"
                />
                <button
                  id="transmission-submit-btn"
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-pink-500/25"
                >
                  <span>Connect</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Liner Notes Card */}
        <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-8 mb-20 text-xs font-mono-tech text-zinc-400 leading-relaxed">
          <div className="text-pink-400 font-bold uppercase tracking-[0.2em] mb-2">
            ARCHIVE LINER NOTES // TRANSMISSION 1985-TO-INFINITY
          </div>
          <p className="mb-2">
            Executive Production: DARRIK • Mixed and Engineered with analog tape saturation & neural spatial processors • Rooted in the rich musical traditions of Ohio Funk (Dayton, Cincinnati, Cleveland) and propelled into the future of sonic storytelling.
          </p>
          <div className="text-zinc-500 text-[10px] tracking-wider uppercase">
            Mastered for 44.1kHz / 24-bit Audiophile Output • All tracks composed and performed by DARRIK.
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Left: Wordmark & Core Line */}
          <div>
            <div className="font-display-modern text-2xl font-black tracking-[0.35em] text-pink-500 uppercase mb-1">
              DARRIK
            </div>
            <div className="font-editorial text-sm text-zinc-300 font-semibold uppercase tracking-wider mb-0.5">
              A Long Way From Home
            </div>
            <div className="text-xs text-zinc-400 font-light">
              “An 80’s soul moving through the AI age.”
            </div>
          </div>

          {/* Center: Epoch lineage */}
          <div className="text-xs font-mono-tech text-zinc-400">
            <span className="text-pink-400 font-semibold">1985 → ∞</span>
            <span className="mx-2 text-zinc-600">•</span>
            <span>Ohio Lineage</span>
            <span className="mx-2 text-zinc-600">•</span>
            <span>All Rights Reserved</span>
          </div>

          {/* Right: Back to top button */}
          <button
            id="back-to-top-btn"
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono-tech text-zinc-300 hover:text-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </footer>

      </div>
    </section>
  );
};
