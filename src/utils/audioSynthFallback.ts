// Web Audio API 80s Synth Generator for seamless in-browser playback fallback
// Provides authentic warm analog polyphonic pads, basslines, and retro arpeggios per track

class SynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private currentTrackIndex: number = 0;
  private masterGain: GainNode | null = null;
  private volume: number = 0.8;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private simulatedTime: number = 0;
  private timerInterval: any = null;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume * 0.4, this.ctx.currentTime, 0.05);
    }
  }

  public startTrack(trackIndex: number, startTime: number = 0, onTimeUpdate?: (time: number) => void) {
    this.stop();
    this.currentTrackIndex = trackIndex;
    this.simulatedTime = startTime;
    this.onTimeUpdateCallback = onTimeUpdate || null;
    this.isPlaying = true;

    try {
      const ctx = this.getAudioContext();
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
      this.masterGain.connect(ctx.destination);

      // Track chord progressions (root frequencies in Hz)
      const scaleProgression = [
        [185.0, 220.0, 277.18, 329.63], // F#m7
        [146.83, 185.0, 220.0, 293.66], // Dmaj7
        [220.0, 277.18, 329.63, 440.0], // A
        [164.81, 196.0, 246.94, 329.63], // Em7
        [196.0, 233.08, 293.66, 349.23], // Gm7
        [246.94, 293.66, 369.99, 440.0], // Bm7
        [130.81, 164.81, 196.0, 261.63], // Cmaj7
        [174.61, 207.65, 261.63, 311.13], // Fm7
        [207.65, 246.94, 311.13, 415.3], // G#m7
        [146.83, 185.0, 220.0, 293.66], // D
        [220.0, 261.63, 329.63, 392.0], // Am7
        [138.59, 164.81, 207.65, 277.18], // C#m
        [164.81, 207.65, 246.94, 329.63], // Emaj7
        [174.61, 207.65, 261.63, 349.23], // Fm
      ];

      const chords = scaleProgression[trackIndex % scaleProgression.length];
      let step = 0;

      const playNote = () => {
        if (!this.isPlaying || !this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const noteFreq = chords[step % chords.length] * (step % 2 === 0 ? 1 : 1.5);
        const bassFreq = chords[0] / 2;

        // Lead / Arp oscillator (Warm Sawtooth)
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = step % 4 === 0 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(noteFreq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.1);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(0.25, now + 0.03);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.45);

        // Warm Sub Bass on beat 0 and 2
        if (step % 2 === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(bassFreq, now);

          bassGain.gain.setValueAtTime(0.3, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

          bassOsc.connect(bassGain);
          bassGain.connect(this.masterGain);

          bassOsc.start(now);
          bassOsc.stop(now + 0.65);
        }

        step = (step + 1) % 16;
      };

      playNote();
      const tempo = 220; // ms per 16th note
      this.intervalId = setInterval(playNote, tempo);

      this.timerInterval = setInterval(() => {
        if (this.isPlaying) {
          this.simulatedTime += 0.25;
          if (this.onTimeUpdateCallback) {
            this.onTimeUpdateCallback(this.simulatedTime);
          }
        }
      }, 250);

    } catch (e) {
      console.warn('Web Audio synth could not initialize', e);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.05);
    }
  }

  public resume() {
    if (!this.isPlaying) {
      this.startTrack(this.currentTrackIndex, this.simulatedTime, this.onTimeUpdateCallback || undefined);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public seek(seconds: number) {
    this.simulatedTime = seconds;
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.simulatedTime);
    }
  }
}

export const synthFallback = new SynthEngine();
