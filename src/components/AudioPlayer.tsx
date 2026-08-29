import React, { useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Repeat,
  Share2,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { Track } from '../types';

interface AudioPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  isAudioAvailable: boolean;
  onImportAudioFiles?: (files: FileList | File[]) => void;
  loadedAudioCount?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSeek,
  onVolumeChange,
  onToggleMute,
  isAudioAvailable,
  onImportAudioFiles,
  loadedAudioCount = 0,
}) => {
  const scrubberRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImportAudioFiles) {
      onImportAudioFiles(e.target.files);
    }
  };

  // Time formatter MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  // Handle Scrubbing Input
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  // Keyboard Seeking when Scrubber is focused
  const handleScrubberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      e.stopPropagation();
      e.preventDefault();
      onSeek(Math.max(0, currentTime - 5));
    } else if (e.key === 'ArrowRight') {
      e.stopPropagation();
      e.preventDefault();
      onSeek(Math.min(duration, currentTime + 5));
    } else if (e.key === 'Home') {
      e.stopPropagation();
      e.preventDefault();
      onSeek(0);
    } else if (e.key === 'End') {
      e.stopPropagation();
      e.preventDefault();
      onSeek(duration);
    }
  };

  // Percentage Quick Jumps
  const handleJumpPercent = (pct: number) => {
    if (duration > 0) {
      onSeek((pct / 100) * duration);
    }
  };

  return (
    <div
      id="custom-audio-player-panel"
      className="w-full rounded-2xl bg-[#0c0a14]/95 border border-pink-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-pink-950/40 relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background Decorative Neon Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Meta Header: Track count & Transmission status */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono-tech font-bold uppercase tracking-widest bg-pink-500/20 text-pink-300 border border-pink-500/40">
              TRACK {currentTrack.trackNumber < 10 ? `0${currentTrack.trackNumber}` : currentTrack.trackNumber} / {tracks.length < 10 ? `0${tracks.length}` : tracks.length}
            </span>
            <span className="hidden sm:inline-block text-xs font-mono-tech text-zinc-400 uppercase tracking-wider">
              {currentTrack.key || '44.1kHz • 24-bit'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono-tech uppercase tracking-widest text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>TRANSMITTING SIGNAL</span>
          </div>
        </div>

        {/* Track Title and Signal Phrase */}
        <div className="mb-6">
          <h3
            id="player-active-track-title"
            className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white uppercase tracking-tight mb-1"
          >
            {currentTrack.title}
          </h3>
          <p className="text-xs sm:text-sm font-mono-tech text-pink-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>{currentTrack.signalPhrase}</span>
          </p>
          {currentTrack.description && (
            <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed max-w-lg">
              {currentTrack.description}
            </p>
          )}
        </div>

        {/* Animated Frequency Visualizer Bars */}
        <div className="flex items-end justify-between gap-1 h-10 w-full py-1 mb-6 px-1 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
          {Array.from({ length: 28 }).map((_, i) => {
            // Dynamic height based on playback state
            const barHeight = isPlaying
              ? Math.max(12, Math.sin((i * 0.4) + currentTime * 4) * 40 + 50)
              : 8;
            const isHot = i % 4 === 0;

            return (
              <div
                key={i}
                style={{ height: `${barHeight}%` }}
                className={`w-full rounded-xs transition-all duration-150 ${
                  isHot
                    ? 'bg-gradient-to-t from-pink-600 to-pink-400'
                    : 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                } ${!isPlaying ? 'opacity-30' : 'opacity-90'}`}
              />
            );
          })}
        </div>
      </div>

      {/* Scrubber and Time Display */}
      <div className="space-y-2 mb-6">
        <div className="relative flex items-center group">
          {/* Background Track with Filled Gradient */}
          <div className="w-full h-2 rounded-full bg-zinc-800 relative overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-400 rounded-full transition-all duration-75 shadow-sm"
            />
          </div>

          {/* HTML5 Range Input for Scrubbing */}
          <input
            id="audio-progress-scrubber"
            ref={scrubberRef}
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleScrubberChange}
            onKeyDown={handleScrubberKeyDown}
            aria-label="Seek track progress"
            className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer z-20"
          />

          {/* Glowing Playhead Thumb */}
          <div
            style={{ left: `${progressPercent}%` }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-pink-500 shadow-md shadow-pink-500/80 pointer-events-none transition-all group-hover:scale-125 z-10"
          />
        </div>

        {/* Time Readout & Percentage Quick Jumps */}
        <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-pink-300 font-semibold">{formatTime(currentTime)}</span>
            <span className="text-zinc-600">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* 25%, 50%, 75% Quick Jump Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline">
              Jump:
            </span>
            {[25, 50, 75].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleJumpPercent(pct)}
                className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-zinc-900/80 hover:bg-pink-500/20 text-zinc-300 hover:text-pink-300 border border-zinc-800 hover:border-pink-500/40 transition-colors focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
                title={`Jump to ${pct}% of track`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
        
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-3">
          {/* Previous Track */}
          <button
            id="player-prev-track-btn"
            type="button"
            onClick={onPrevTrack}
            className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer active:scale-95"
            aria-label="Previous track (Left Arrow)"
            title="Previous track (Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            id="player-play-pause-btn"
            type="button"
            onClick={onTogglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/40 glow-pink-md focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
            aria-label={isPlaying ? 'Pause track' : 'Play track'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            id="player-next-track-btn"
            type="button"
            onClick={onNextTrack}
            className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer active:scale-95"
            aria-label="Next track (Right Arrow)"
            title="Next track (Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume & Additional Audio Controls */}
        <div className="flex items-center gap-3">
          <button
            id="player-mute-toggle-btn"
            type="button"
            onClick={onToggleMute}
            className="w-8 h-8 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-pink-400 flex items-center justify-center transition-colors focus:outline-none"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-pink-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-zinc-300" />
            )}
          </button>

          {/* Volume Slider */}
          <div className="w-20 sm:w-24 relative flex items-center">
            <input
              id="player-volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="Adjust volume"
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <span className="text-[10px] font-mono-tech text-zinc-400 uppercase tracking-widest hidden md:inline">
            {isMuted ? 'MUTED' : `${Math.round(volume * 100)}%`}
          </span>
        </div>

      </div>

      {/* Hidden file input for direct audio file upload / drag-drop assist */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,.mp3,.wav,.m4a"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Subtle Audio Status Footnote */}
      <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between gap-2 text-[11px] font-mono-tech text-zinc-400">
        <div className="flex items-center gap-1.5">
          {loadedAudioCount > 0 ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">
                {loadedAudioCount} / {tracks.length} MP3 AUDIO FILES ATTACHED
              </span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>PUBLIC / AUDIO CONNECTED (14 TRACKS)</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
          title="Attach or re-load 14 MP3 files from your device"
        >
          <Upload className="w-3 h-3" />
          <span>Select MP3s</span>
        </button>
      </div>
    </div>
  );
};
