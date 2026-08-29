import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Disc, Play, Pause, Sparkles } from 'lucide-react';
import { Track } from '../types';

interface VinylOrbitProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number, autoPlay?: boolean) => void;
}

export const VinylOrbit: React.FC<VinylOrbitProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
}) => {
  const totalTracks = tracks.length;
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Calculate rotation angle for vinyl based on selected track index
  const targetRotation = (currentTrackIndex / totalTracks) * 360;

  // Generate 14 nodes around the circular orbit (diameter ~ 420px on desktop)
  const orbitNodes = useMemo(() => {
    return tracks.map((track, index) => {
      // Angle in radians, starting from top (-90 deg)
      const angleDeg = (index / totalTracks) * 360 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      return {
        track,
        index,
        angleDeg,
        angleRad,
      };
    });
  }, [tracks, totalTracks]);

  return (
    <div
      id="vinyl-orbit-stage"
      className="relative w-full max-w-[480px] sm:max-w-[540px] aspect-square mx-auto flex items-center justify-center select-none"
    >
      {/* Outer Glow Halo */}
      <div className="absolute inset-4 rounded-full bg-radial from-pink-500/15 via-cyan-500/10 to-transparent filter blur-3xl pointer-events-none" />

      {/* Orbit Ring Background Track SVG */}
      <svg
        viewBox="0 0 540 540"
        className="w-full h-full absolute inset-0 pointer-events-none overflow-visible"
      >
        <defs>
          <linearGradient id="circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2d87" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#8a2be2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Orbit Path Guide Ring */}
        <circle
          cx="270"
          cy="270"
          r="230"
          fill="none"
          stroke="url(#circle-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-60"
        />

        {/* Secondary inner alignment ring */}
        <circle
          cx="270"
          cy="270"
          r="165"
          fill="none"
          stroke="#ff2d87"
          strokeWidth="0.75"
          strokeDasharray="2 6"
          className="opacity-30"
        />
      </svg>

      {/* Rotating Vinyl Record Disk */}
      <div
        id="vinyl-record-disc"
        style={{
          transform: `rotate(${targetRotation}deg)`,
          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="relative w-[280px] sm:w-[330px] md:w-[360px] aspect-square rounded-full shadow-2xl shadow-black border border-zinc-700/60 p-2 flex items-center justify-center z-10 cursor-pointer group"
        onClick={() => onSelectTrack(currentTrackIndex, !isPlaying)}
        title="Click vinyl to play or pause"
      >
        {/* Continuous spinning container when playing */}
        <div
          className={`w-full h-full rounded-full vinyl-grooves relative flex items-center justify-center overflow-hidden border border-zinc-900 ${
            isPlaying ? 'animate-spin-slow' : 'paused-spin'
          }`}
        >
          {/* Vinyl Reflection Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/10 via-transparent to-cyan-500/10 rounded-full pointer-events-none" />

          {/* Concentric Vinyl Grooves Lines */}
          <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-18 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-24 rounded-full border border-white/5 pointer-events-none" />

          {/* Center Label */}
          <div className="relative w-28 sm:w-34 aspect-square rounded-full bg-gradient-to-tr from-[#1a0826] via-[#240d38] to-[#0d1e3a] border-2 border-pink-500/60 shadow-inner flex flex-col items-center justify-center text-center p-2 z-20">
            {/* Center Spindle Hole */}
            <div className="w-4 h-4 rounded-full bg-[#06060a] border-2 border-zinc-400 shadow-inner mb-1" />

            <span className="text-[8px] font-display-modern font-black tracking-[0.25em] text-pink-400 uppercase leading-none">
              DARRIK
            </span>
            <span className="text-[7px] font-mono-tech text-cyan-300 uppercase tracking-widest mt-0.5 max-w-[80px] truncate">
              0{currentTrack.trackNumber} • {currentTrack.title}
            </span>
            <span className="text-[6px] font-mono-tech text-zinc-400 uppercase tracking-widest mt-0.5">
              1985 → ∞
            </span>

            {/* Play/Pause Overlay on Hover */}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-pink-400 drop-shadow-md" />
              ) : (
                <Play className="w-6 h-6 text-cyan-400 ml-1 drop-shadow-md" />
              )}
            </div>
          </div>
        </div>

        {/* Outer Rim Chrome Highlight */}
        <div className="absolute inset-0 rounded-full border-2 border-pink-500/20 pointer-events-none" />
      </div>

      {/* 14 Circular Orbit Nodes positioned evenly */}
      {orbitNodes.map(({ track, index, angleRad }) => {
        const isCurrent = currentTrackIndex === index;
        // Radius in percentage of container (approx 42.5% from center)
        const radiusPercent = 43.5;
        const leftPercent = 50 + radiusPercent * Math.cos(angleRad);
        const topPercent = 50 + radiusPercent * Math.sin(angleRad);

        return (
          <button
            key={track.id}
            id={`orbit-node-${track.trackNumber}`}
            type="button"
            onClick={() => onSelectTrack(index, true)}
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-30 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 group cursor-pointer focus:outline-none ${
              isCurrent
                ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white scale-125 glow-pink-md ring-2 ring-white z-40'
                : 'bg-[#0e0e18]/95 text-zinc-400 border border-zinc-700/80 hover:border-pink-400 hover:text-white hover:scale-110'
            }`}
            aria-label={`Select track ${track.trackNumber}: ${track.title}`}
          >
            <span className="font-mono-tech text-[11px] sm:text-xs font-bold leading-none">
              {track.trackNumber < 10 ? `0${track.trackNumber}` : track.trackNumber}
            </span>

            {/* Hover Tooltip Card */}
            <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap bg-[#0b0914]/95 border border-pink-500/50 px-3 py-1.5 rounded-lg text-xs shadow-2xl z-50 text-left">
              <div className="text-pink-400 font-mono-tech text-[10px] font-semibold uppercase">
                SIGNAL 0{track.trackNumber}
              </div>
              <div className="text-white font-editorial font-bold text-xs">{track.title}</div>
              <div className="text-cyan-300 font-mono-tech text-[9px]">{track.signalPhrase}</div>
            </div>
          </button>
        );
      })}

      {/* Active Track Needle / Laser Scanner Marker */}
      <div className="absolute top-2 right-4 sm:right-8 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/80 border border-pink-500/30 text-[10px] font-mono-tech text-pink-300 uppercase tracking-widest pointer-events-none backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
        <span>RADIAL ORBIT // 14 NODES</span>
      </div>
    </div>
  );
};
