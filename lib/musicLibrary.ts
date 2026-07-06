/**
 * Music Library - Uncopyrighted synthesized patterns for all grade levels
 * No external dependencies - all generated via Web Audio API
 * 
 * Use Cases:
 * - Lullaby: Preschool wind-down, naptime
 * - Sleep: Elementary/Middle school rest periods
 * - Play/Dance: Energetic movement activities
 * - Focus: High school study sessions
 */

export interface MusicPattern {
  id: string;
  name: string;
  gradeRange: 'PreK-K' | 'Elementary' | 'Middle' | 'High' | 'All';
  frequencies: number[];
  tempo: number; // milliseconds between note changes
  volume: number; // 0-1
  layers: MusicLayer[];
  description: string;
}

export interface MusicLayer {
  type: 'sine' | 'triangle' | 'square' | 'sawtooth';
  volumeMultiplier: number;
  frequencyMultiplier: number;
  envelope: { attack: number; decay: number; sustain: number; release: number };
}

// === LULLABY PATTERNS ===
// Slow, calming, perfect for pre-K naptime
const LULLABY_GENTLE: MusicPattern = {
  id: 'lullaby-gentle',
  name: '🌙 Gentle Lullaby',
  gradeRange: 'PreK-K',
  frequencies: [261.63, 293.66, 329.63, 349.23, 329.63, 293.66],
  tempo: 3000,
  volume: 0.08,
  layers: [
    {
      type: 'sine',
      volumeMultiplier: 1,
      frequencyMultiplier: 1,
      envelope: { attack: 1.5, decay: 0.5, sustain: 0.3, release: 1.5 }
    },
    {
      type: 'sine',
      volumeMultiplier: 0.4,
      frequencyMultiplier: 0.5,
      envelope: { attack: 2, decay: 1, sustain: 0.2, release: 2 }
    }
  ],
  description: 'Soothing foundation for naptime. 6-note gentle cycle.'
};

// === SLEEP PATTERNS ===
// Deep, rhythmic for older students (Elementary+)
const SLEEP_DEEP: MusicPattern = {
  id: 'sleep-deep',
  name: '😴 Deep Sleep Rhythm',
  gradeRange: 'Elementary',
  frequencies: [220, 246.94, 220, 196, 220, 246.94],
  tempo: 2400,
  volume: 0.06,
  layers: [
    {
      type: 'sine',
      volumeMultiplier: 1,
      frequencyMultiplier: 1,
      envelope: { attack: 2, decay: 1, sustain: 0.2, release: 2 }
    },
    {
      type: 'sine',
      volumeMultiplier: 0.5,
      frequencyMultiplier: 2,
      envelope: { attack: 1, decay: 0.5, sustain: 0.3, release: 1 }
    },
    {
      type: 'triangle',
      volumeMultiplier: 0.25,
      frequencyMultiplier: 0.25,
      envelope: { attack: 3, decay: 2, sustain: 0.1, release: 3 }
    }
  ],
  description: 'Deeper resonance for middle grades. Binaural effect.'
};

// === PLAY PATTERNS ===
// Upbeat, energetic for movement
const PLAY_ENERGETIC: MusicPattern = {
  id: 'play-energetic',
  name: '🎉 Play & Movement',
  gradeRange: 'All',
  frequencies: [329.63, 392, 440, 392, 329.63, 293.66, 329.63, 392],
  tempo: 600,
  volume: 0.12,
  layers: [
    {
      type: 'triangle',
      volumeMultiplier: 1,
      frequencyMultiplier: 1,
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.1 }
    },
    {
      type: 'sine',
      volumeMultiplier: 0.6,
      frequencyMultiplier: 1.5,
      envelope: { attack: 0.15, decay: 0.3, sustain: 0.4, release: 0.15 }
    }
  ],
  description: 'Bright, bouncy rhythm for active play and dance.'
};

// === DANCE PATTERNS ===
// Groovy, rhythmic for upper grades
const DANCE_GROOVE: MusicPattern = {
  id: 'dance-groove',
  name: '💃 Dance Groove',
  gradeRange: 'Elementary',
  frequencies: [164.81, 196, 220, 246.94, 220, 196],
  tempo: 500,
  volume: 0.11,
  layers: [
    {
      type: 'square',
      volumeMultiplier: 0.8,
      frequencyMultiplier: 1,
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.6, release: 0.05 }
    },
    {
      type: 'sine',
      volumeMultiplier: 0.5,
      frequencyMultiplier: 2,
      envelope: { attack: 0.08, decay: 0.15, sustain: 0.5, release: 0.08 }
    },
    {
      type: 'sine',
      volumeMultiplier: 0.3,
      frequencyMultiplier: 0.5,
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.4, release: 0.1 }
    }
  ],
  description: 'Steady beat with layered groove for partner/group dance.'
};

// === FOCUS PATTERNS ===
// Complex, engaging for high school study
const FOCUS_STUDY: MusicPattern = {
  id: 'focus-study',
  name: '🎯 Study Focus',
  gradeRange: 'High',
  frequencies: [256, 384, 512, 384, 256, 320, 256, 240],
  tempo: 2000,
  volume: 0.07,
  layers: [
    {
      type: 'sine',
      volumeMultiplier: 1,
      frequencyMultiplier: 1,
      envelope: { attack: 0.8, decay: 0.3, sustain: 0.4, release: 0.8 }
    },
    {
      type: 'sine',
      volumeMultiplier: 0.6,
      frequencyMultiplier: 1.5,
      envelope: { attack: 1, decay: 0.4, sustain: 0.3, release: 1 }
    },
    {
      type: 'triangle',
      volumeMultiplier: 0.3,
      frequencyMultiplier: 2.5,
      envelope: { attack: 0.5, decay: 0.2, sustain: 0.5, release: 0.5 }
    }
  ],
  description: 'Complex harmonic layers for concentration. No distraction.'
};

// === EXPLORE PATTERN ===
// Interactive, playful for all grades
const EXPLORE_INTERACTIVE: MusicPattern = {
  id: 'explore-interactive',
  name: '🔍 Explore & Discover',
  gradeRange: 'All',
  frequencies: [293.66, 329.63, 392, 440, 392, 329.63, 293.66, 246.94],
  tempo: 1200,
  volume: 0.09,
  layers: [
    {
      type: 'sine',
      volumeMultiplier: 1,
      frequencyMultiplier: 1,
      envelope: { attack: 0.2, decay: 0.1, sustain: 0.5, release: 0.2 }
    },
    {
      type: 'sine',
      volumeMultiplier: 0.5,
      frequencyMultiplier: 2,
      envelope: { attack: 0.15, decay: 0.15, sustain: 0.4, release: 0.15 }
    }
  ],
  description: 'Curiosity-inspiring pattern. Ascending/descending scale.'
};

export const musicLibrary: Record<string, MusicPattern> = {
  'lullaby-gentle': LULLABY_GENTLE,
  'sleep-deep': SLEEP_DEEP,
  'play-energetic': PLAY_ENERGETIC,
  'dance-groove': DANCE_GROOVE,
  'focus-study': FOCUS_STUDY,
  'explore-interactive': EXPLORE_INTERACTIVE,
};

export function getMusicByCategory(
  category: 'lullaby' | 'sleep' | 'play' | 'dance' | 'focus' | 'explore'
): MusicPattern[] {
  return Object.values(musicLibrary).filter((m) =>
    m.id.startsWith(category)
  );
}

export function getMusicByGradeRange(
  grade: 'PreK-K' | 'Elementary' | 'Middle' | 'High' | 'All'
): MusicPattern[] {
  return Object.values(musicLibrary).filter(
    (m) => m.gradeRange === grade || m.gradeRange === 'All'
  );
}
