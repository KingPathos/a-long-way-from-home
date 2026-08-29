import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Disc3, Radio, Sparkles } from 'lucide-react';

interface NavbarProps {
  isPlaying: boolean;
  activeTrackTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({ isPlaying, activeTrackTitle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'The journey', href: '#journey' },
    { label: 'Tracks', href: '#album' },
    { label: 'The signal', href: '#signal' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#06060a]/90 backdrop-blur-md border-b border-pink-500/20 shadow-lg shadow-black/50'
          : 'bg-[#06060a]/60 backdrop-blur-sm border-b border-pink-500/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Spaced Magenta Wordmark DARRIK */}
        <a
          href="#"
          id="brand-logo"
          className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 rounded-lg p-1"
        >
          <span className="font-display-modern text-xl sm:text-2xl font-black tracking-[0.35em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-400 to-pink-500 group-hover:drop-shadow-[0_0_12px_rgba(255,45,135,0.8)] transition-all">
            DARRIK
          </span>
          {isPlaying && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech tracking-wider uppercase bg-pink-500/10 border border-pink-500/30 text-pink-400 animate-pulse">
              <Disc3 className="w-3 h-3 animate-spin" />
              <span className="max-w-[120px] truncate">{activeTrackTitle}</span>
            </span>
          )}
        </a>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs uppercase font-mono-tech tracking-[0.2em] text-zinc-400 hover:text-pink-400 transition-colors relative py-1 focus:outline-none focus:text-pink-400"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-pink-500 transition-all duration-300 hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: 1985 → ∞ and Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <div
            id="epoch-indicator"
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono-tech tracking-widest text-zinc-300"
          >
            <span className="text-pink-400 font-semibold">1985</span>
            <span className="text-zinc-500">→</span>
            <span className="text-cyan-400 text-base leading-none font-bold">∞</span>
          </div>

          {/* Accessible 2-line mobile menu button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-zinc-900/60 border border-pink-500/30 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <span
              className={`w-5 h-[2px] bg-pink-400 transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : '-translate-y-1'
              }`}
            />
            <span
              className={`w-5 h-[2px] bg-cyan-400 transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : 'translate-y-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#0a0a10]/95 backdrop-blur-xl border-b border-pink-500/30 px-6 py-6 overflow-hidden"
          >
            <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-mono-tech uppercase tracking-[0.2em] text-zinc-300 hover:text-pink-400 py-2 border-b border-zinc-850 flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-pink-500">→</span>
                </a>
              ))}
              <div className="pt-2 flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                <span>EPOCH ARCHIVE</span>
                <span className="text-cyan-400 font-semibold">1985 → ∞</span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
