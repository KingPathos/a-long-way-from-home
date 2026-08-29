import React from 'react';
import { VinylOrbit } from './VinylOrbit';
import { AudioPlayer } from './AudioPlayer';
import { TrackList } from './TrackList';
import { Track } from '../types';

interface AlbumSectionProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isAudioAvailable: boolean;
  onSelectTrack: (index: number, autoPlay?: boolean) => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onImportAudioFiles?: (files: FileList | File[]) => void;
  loadedAudioCount?: number;
}

export const AlbumSection: React.FC<AlbumSectionProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isAudioAvailable,
  onSelectTrack,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onImportAudioFiles,
  loadedAudioCount = 0,
}) => {
  return (
    <section
      id="album"
      className="relative py-28 px-4 sm:px-6 lg:px-12 bg-[#06060a] border-b border-pink-500/10 overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 retro-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-xs font-mono-tech tracking-[0.3em] uppercase text-pink-400 mb-4">
            <span className="w-2 h-2 rounded-sm bg-pink-500" />
            <span>02 / THE ALBUM</span>
          </div>

          {/* Kicker */}
          <p className="text-sm sm:text-base font-mono-tech text-cyan-400 uppercase tracking-widest mb-3">
            Fourteen destinations
          </p>

          {/* Heading */}
          <h2
            id="album-heading"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight uppercase mb-6"
          >
            Rotate the record.
          </h2>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Click a signal around the orbit or use the arrows. Every stop reveals another chapter in the journey.
          </p>
        </div>

        {/* Interactive Dual Stage: 14-Node Vinyl Orbit + Player Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left / Top: Rotating Vinyl Record & Orbit */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <VinylOrbit
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onSelectTrack={onSelectTrack}
            />
          </div>

          {/* Right / Bottom: Custom Audio Player Console */}
          <div className="lg:col-span-6 flex items-center justify-center w-full">
            <AudioPlayer
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              isMuted={isMuted}
              onTogglePlay={onTogglePlay}
              onNextTrack={onNextTrack}
              onPrevTrack={onPrevTrack}
              onSeek={onSeek}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
              isAudioAvailable={isAudioAvailable}
              onImportAudioFiles={onImportAudioFiles}
              loadedAudioCount={loadedAudioCount}
            />
          </div>

        </div>

        {/* Ordered Track List Stage */}
        <TrackList
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          onSelectTrack={onSelectTrack}
        />

      </div>
    </section>
  );
};
