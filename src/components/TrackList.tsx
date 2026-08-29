import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Disc3, Radio, Sparkles, Volume2 } from 'lucide-react';
import { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number, autoPlay?: boolean) => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
}) => {
  const handleTrackClick = (index: number) => {
    onSelectTrack(index, true);
    // Smooth scroll back to player console
    const playerEl = document.getElementById('album');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="full-tracklist-section" className="mt-16 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-mono-tech uppercase tracking-[0.25em] text-pink-400 block mb-1">
            Complete Audio Archive
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white uppercase">
            Fourteen Continuous Transmissions
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>TOTAL RUNTIME: 48 MIN • OHIO FUNK LINEAGE</span>
        </div>
      </div>

      {/* Grid / List of 14 Tracks */}
      <div className="grid grid-cols-1 gap-3">
        {tracks.map((track, index) => {
          const isCurrent = currentTrackIndex === index;
          const isThisPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.id}
              id={`tracklist-row-${track.trackNumber}`}
              onClick={() => handleTrackClick(index)}
              className={`group flex items-center justify-between p-4 sm:px-6 sm:py-4.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                isCurrent
                  ? 'bg-[#150d22]/90 border-pink-500/60 shadow-lg shadow-pink-950/40 text-white'
                  : 'bg-[#0a0a12]/70 hover:bg-[#11111c]/90 border-zinc-800/80 hover:border-pink-500/30 text-zinc-300'
              }`}
            >
              {/* Left Side: Track Number, Play Icon, Title, Signal */}
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                {/* Number or Equalizer Bars */}
                <div className="w-8 flex items-center justify-center font-mono-tech text-sm">
                  {isThisPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 h-full bg-pink-500 rounded-xs animate-bounce" />
                      <span className="w-1 h-3/4 bg-cyan-400 rounded-xs animate-pulse" />
                      <span className="w-1 h-full bg-pink-500 rounded-xs animate-bounce" />
                    </div>
                  ) : (
                    <span
                      className={`font-bold transition-colors ${
                        isCurrent
                          ? 'text-pink-400'
                          : 'text-zinc-400 group-hover:text-pink-400'
                      }`}
                    >
                      {track.trackNumber < 10 ? `0${track.trackNumber}` : track.trackNumber}
                    </span>
                  )}
                </div>

                {/* Play Button Icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCurrent) {
                      onSelectTrack(index, !isPlaying);
                    } else {
                      handleTrackClick(index);
                    }
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/50 scale-105'
                      : 'bg-zinc-800/90 text-zinc-300 group-hover:bg-pink-500 group-hover:text-white'
                  }`}
                  aria-label={isThisPlaying ? 'Pause track' : 'Play track'}
                >
                  {isThisPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Title and Signal */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-editorial text-base sm:text-lg font-bold truncate transition-colors ${
                        isCurrent
                          ? 'text-white'
                          : 'text-zinc-200 group-hover:text-pink-300'
                      }`}
                    >
                      {track.title}
                    </h4>
                    {isCurrent && (
                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono-tech tracking-wider uppercase bg-pink-500/20 text-pink-300 border border-pink-500/40">
                        NOW PLAYING
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono-tech text-zinc-400 group-hover:text-zinc-300 truncate">
                    {track.signalPhrase}
                  </p>
                </div>
              </div>

              {/* Right Side: Vibe Badge and Duration */}
              <div className="flex items-center gap-4 sm:gap-6 shrink-0 pl-2">
                {track.vibe && (
                  <span className="hidden md:inline-block text-[11px] font-mono-tech text-zinc-400 max-w-[200px] truncate">
                    {track.vibe}
                  </span>
                )}
                <span className="text-xs font-mono-tech text-zinc-400 group-hover:text-pink-300 transition-colors">
                  {track.duration || '3:30'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
