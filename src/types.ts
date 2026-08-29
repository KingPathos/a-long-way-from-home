export interface Track {
  id: number;
  trackNumber: number;
  title: string;
  signalPhrase: string;
  audioSrc: string;
  duration?: string; // formatted e.g. "3:42"
  approxDurationSec?: number;
  description?: string;
  bpm?: number;
  key?: string;
  vibe?: string;
}

export interface PlayerState {
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  isAudioAvailable: boolean;
  usingSynthFallback: boolean;
}
