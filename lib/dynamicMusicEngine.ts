/**
 * Enhanced dynamic music engine for The Whale
 * Supports dynamic patterns, adaptive intensity, and school-appropriate compositions
 */

export interface DynamicMusicPattern {
  name: string;
  emoji: string;
  description: string;
  baseTempo: number; // BPM
  timeSignature: [number, number];
  intensity: 'calm' | 'focused' | 'energetic' | 'playful';
  mode: 'major' | 'minor' | 'pentatonic';
  frequencies: number[]; // Base frequencies for the pattern
  pattern: number[]; // Sequence pattern
  duration: number; // Duration in seconds
  layers: {
    bass?: { frequency: number; intensity: number };
    melody?: { frequencies: number[]; pattern: number[] };
    harmony?: { frequencies: number[]; pattern: number[] };
    percussion?: { pattern: number[] };
  };
}

export const DYNAMIC_MUSIC_PATTERNS: Record<string, DynamicMusicPattern> = {
  FOCUS_STUDY: {
    name: 'Focus Study Session',
    emoji: '🎯',
    description: 'Deep concentration with sustained harmonic foundation',
    baseTempo: 60,
    timeSignature: [4, 4],
    intensity: 'focused',
    mode: 'major',
    frequencies: [261.63, 293.66, 329.63, 349.23, 392.00], // C Major scale
    pattern: [0, 2, 4, 2, 0, 2, 4, 2],
    duration: 300,
    layers: {
      bass: { frequency: 130.81, intensity: 0.3 },
      melody: {
        frequencies: [523.25, 587.33, 659.25, 783.99, 880.00],
        pattern: [0, 1, 2, 1, 0, 2, 4, 2]
      },
      harmony: {
        frequencies: [392.00, 523.25, 659.25],
        pattern: [0, 0, 1, 1, 2, 2, 1, 1]
      },
      percussion: { pattern: [1, 0, 0, 0, 1, 0, 0, 0] }
    }
  },

  LULLABY_GENTLE: {
    name: 'Gentle Lullaby',
    emoji: '🌙',
    description: 'Soothing rhythmic patterns for calming atmosphere',
    baseTempo: 40,
    timeSignature: [3, 4],
    intensity: 'calm',
    mode: 'major',
    frequencies: [264.00, 297.00, 330.00, 352.00, 396.00], // C major, lower octave
    pattern: [0, 1, 2, 1, 0, 1],
    duration: 600,
    layers: {
      bass: { frequency: 132.00, intensity: 0.25 },
      melody: {
        frequencies: [396.00, 440.00, 495.00, 528.00],
        pattern: [0, 1, 2, 3, 2, 1]
      },
      harmony: {
        frequencies: [264.00, 330.00, 396.00],
        pattern: [0, 0, 1, 1, 2, 2]
      },
      percussion: { pattern: [1, 0, 0, 0, 0, 0] }
    }
  },

  PLAY_ENERGETIC: {
    name: 'Playful Energy',
    emoji: '🎉',
    description: 'Upbeat patterns with rhythmic drive',
    baseTempo: 110,
    timeSignature: [4, 4],
    intensity: 'playful',
    mode: 'major',
    frequencies: [329.63, 369.99, 415.30, 466.16, 523.25], // E major
    pattern: [0, 1, 2, 1, 3, 1, 4, 1],
    duration: 180,
    layers: {
      bass: { frequency: 164.81, intensity: 0.35 },
      melody: {
        frequencies: [659.25, 739.99, 830.61, 932.33],
        pattern: [0, 1, 2, 3, 3, 2, 1, 0]
      },
      harmony: {
        frequencies: [329.63, 415.30, 523.25],
        pattern: [0, 0, 1, 1, 2, 2, 0, 1]
      },
      percussion: { pattern: [1, 0, 1, 0, 1, 0, 1, 1] }
    }
  },

  DANCE_GROOVE: {
    name: 'Dance Groove',
    emoji: '💃',
    description: 'Rhythmic groove with syncopated patterns',
    baseTempo: 120,
    timeSignature: [4, 4],
    intensity: 'energetic',
    mode: 'major',
    frequencies: [293.66, 329.63, 369.99, 415.30, 466.16], // D major
    pattern: [0, 2, 4, 2, 1, 3, 2, 0],
    duration: 240,
    layers: {
      bass: { frequency: 146.83, intensity: 0.4 },
      melody: {
        frequencies: [587.33, 659.25, 739.99, 830.61],
        pattern: [0, 1, 2, 3, 2, 1, 0, 1]
      },
      harmony: {
        frequencies: [293.66, 369.99, 466.16],
        pattern: [0, 0, 1, 1, 2, 2, 1, 0]
      },
      percussion: { pattern: [1, 0, 1, 1, 1, 0, 1, 1] }
    }
  },

  EXPLORE_INTERACTIVE: {
    name: 'Explore & Discover',
    emoji: '🔍',
    description: 'Curious, wandering melodic lines',
    baseTempo: 85,
    timeSignature: [4, 4],
    intensity: 'focused',
    mode: 'pentatonic',
    frequencies: [261.63, 293.66, 329.63, 392.00, 440.00], // Pentatonic scale
    pattern: [0, 1, 2, 3, 4, 3, 2, 1],
    duration: 300,
    layers: {
      bass: { frequency: 130.81, intensity: 0.32 },
      melody: {
        frequencies: [523.25, 587.33, 659.25, 783.99, 880.00],
        pattern: [0, 1, 2, 3, 4, 3, 2, 1]
      },
      harmony: {
        frequencies: [329.63, 392.00, 440.00],
        pattern: [0, 1, 2, 1, 0, 2, 1, 0]
      },
      percussion: { pattern: [1, 0, 0, 1, 0, 0, 1, 0] }
    }
  },

  SLEEP_DEEP: {
    name: 'Deep Sleep Aid',
    emoji: '😴',
    description: 'Minimal, soothing long-form patterns',
    baseTempo: 30,
    timeSignature: [3, 4],
    intensity: 'calm',
    mode: 'minor',
    frequencies: [261.63, 293.66, 329.63, 349.23, 392.00], // C minor
    pattern: [0, 2, 4, 2],
    duration: 900,
    layers: {
      bass: { frequency: 130.81, intensity: 0.2 },
      melody: {
        frequencies: [392.00, 440.00, 493.88],
        pattern: [0, 1, 2, 1]
      },
      harmony: {
        frequencies: [261.63, 329.63],
        pattern: [0, 0, 1, 1]
      },
      percussion: { pattern: [1, 0, 0, 0, 0, 0] }
    }
  }
};

/**
 * Play dynamic music pattern with Web Audio API
 */
export class DynamicMusicEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private currentPattern: DynamicMusicPattern | null = null;
  private nodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filters: BiquadFilterNode[];
  } = {
    oscillators: [],
    gains: [],
    filters: []
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
  }

  /**
   * Play a music pattern
   */
  async play(patternKey: string, intensity: number = 0.3): Promise<void> {
    if (!this.audioContext || this.isPlaying) return;

    const pattern = DYNAMIC_MUSIC_PATTERNS[patternKey];
    if (!pattern) return;

    this.currentPattern = pattern;
    this.isPlaying = true;

    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.playPattern(pattern, intensity);
    } catch (error) {
      console.error('Music playback error:', error);
      this.isPlaying = false;
    }
  }

  private playPattern(pattern: DynamicMusicPattern, intensity: number): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const beatDuration = 60 / pattern.baseTempo;

    // Play melody layer
    if (pattern.layers.melody) {
      this.playLayer(
        pattern.layers.melody.frequencies,
        pattern.layers.melody.pattern,
        beatDuration,
        now,
        intensity * 0.6
      );
    }

    // Play harmony layer
    if (pattern.layers.harmony) {
      this.playLayer(
        pattern.layers.harmony.frequencies,
        pattern.layers.harmony.pattern,
        beatDuration,
        now,
        intensity * 0.4
      );
    }

    // Play bass layer
    if (pattern.layers.bass) {
      const bass = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      bass.frequency.value = pattern.layers.bass.frequency;
      bass.type = 'sine';
      gain.gain.value = intensity * pattern.layers.bass.intensity;

      bass.connect(gain);
      gain.connect(this.audioContext.destination);

      bass.start(now);
      bass.stop(now + pattern.duration);

      this.nodes.oscillators.push(bass);
      this.nodes.gains.push(gain);
    }
  }

  private playLayer(
    frequencies: number[],
    pattern: number[],
    beatDuration: number,
    startTime: number,
    intensity: number
  ): void {
    if (!this.audioContext) return;

    pattern.forEach((freqIndex, step) => {
      if (freqIndex >= frequencies.length) return;

      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();

      osc.frequency.value = frequencies[freqIndex];
      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.value = 2000;

      gain.gain.value = intensity;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext!.destination);

      const stepStartTime = startTime + step * beatDuration * 0.5;
      osc.start(stepStartTime);
      osc.stop(stepStartTime + beatDuration * 0.4);

      this.nodes.oscillators.push(osc);
      this.nodes.gains.push(gain);
      this.nodes.filters.push(filter);
    });
  }

  /**
   * Stop playback and clean up
   */
  stop(): void {
    this.nodes.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.nodes.oscillators = [];
    this.nodes.gains = [];
    this.nodes.filters = [];
    this.isPlaying = false;
    this.currentPattern = null;
  }

  /**
   * Check if playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get current pattern
   */
  getCurrentPattern(): DynamicMusicPattern | null {
    return this.currentPattern;
  }
}

export const musicEngine = new DynamicMusicEngine();
