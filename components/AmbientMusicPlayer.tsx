'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSettings } from './AppSettingsProvider';
import type { MusicPattern } from '@/lib/musicLibrary';
import { musicLibrary, getMusicByCategory } from '@/lib/musicLibrary';

type MusicCategory = 'lullaby' | 'sleep' | 'play' | 'dance' | 'focus' | 'explore';

const categoryEmojis: Record<MusicCategory, string> = {
  lullaby: '🌙',
  sleep: '😴',
  play: '🎉',
  dance: '💃',
  focus: '🎯',
  explore: '🔍',
};

const categoryLabels: Record<MusicCategory, string> = {
  lullaby: 'Lullaby',
  sleep: 'Sleep',
  play: 'Play',
  dance: 'Dance',
  focus: 'Study',
  explore: 'Explore',
};

export function AmbientMusicPlayer() {
  const { settings, setCalmMusicEnabled } = useAppSettings();
  const [currentCategory, setCurrentCategory] = useState<MusicCategory>('explore');
  const [currentPattern, setCurrentPattern] = useState<MusicPattern | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const contextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainsRef = useRef<Map<string, GainNode>>(new Map());
  const masterGainRef = useRef<GainNode | null>(null);
  const envelopeTimersRef = useRef<Map<string, number>>(new Map());
  const stepRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // Initialize pattern on category change
  useEffect(() => {
    const patterns = getMusicByCategory(currentCategory);
    if (patterns.length > 0) {
      setCurrentPattern(patterns[0]);
    }
  }, [currentCategory]);

  function stopMusic() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Clear all envelope timers
    envelopeTimersRef.current.forEach((t) => window.clearTimeout(t));
    envelopeTimersRef.current.clear();

    // Stop all oscillators
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    oscillatorsRef.current.clear();
    gainsRef.current.clear();

    // Fade out master
    if (masterGainRef.current && contextRef.current) {
      masterGainRef.current.gain.setTargetAtTime(0, contextRef.current.currentTime, 0.3);

      setTimeout(() => {
        try {
          contextRef.current?.close();
        } catch {}
        contextRef.current = null;
        masterGainRef.current = null;
      }, 500);
    }

    setIsPlaying(false);
  }

  function startMusic() {
    if (!currentPattern || isPlaying) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0;
    masterGain.gain.setTargetAtTime(
      (settings.appVolume / 100) * currentPattern.volume,
      audioContext.currentTime,
      0.8
    );

    // Create filter for tone shaping
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3000;
    filter.Q.value = 1;

    masterGain.connect(filter);
    filter.connect(audioContext.destination);

    // Create layer oscillators
    currentPattern.layers.forEach((layer, layerIdx) => {
      const osc = audioContext.createOscillator();
      osc.type = layer.type;
      osc.frequency.value = currentPattern.frequencies[0] * layer.frequencyMultiplier;

      const gain = audioContext.createGain();
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();

      oscillatorsRef.current.set(`osc-${layerIdx}`, osc);
      gainsRef.current.set(`gain-${layerIdx}`, gain);
    });

    contextRef.current = audioContext;
    masterGainRef.current = masterGain;
    setIsPlaying(true);

    // Main note sequencer
    timerRef.current = window.setInterval(() => {
      if (!contextRef.current) return;

      stepRef.current = (stepRef.current + 1) % currentPattern.frequencies.length;
      const freq = currentPattern.frequencies[stepRef.current];
      const t = contextRef.current.currentTime;

      // Update each layer with envelope
      currentPattern.layers.forEach((layer, layerIdx) => {
        const osc = oscillatorsRef.current.get(`osc-${layerIdx}`);
        const gain = gainsRef.current.get(`gain-${layerIdx}`);

        if (osc && gain) {
          const targetFreq = freq * layer.frequencyMultiplier;
          osc.frequency.setTargetAtTime(targetFreq, t, 0.05);

          // ADSR Envelope
          const attackTime = layer.envelope.attack;
          const decayTime = layer.envelope.decay;
          const sustainLevel = layer.envelope.sustain;
          const releaseTime = layer.envelope.release;

          gain.gain.setTargetAtTime(
            layer.volumeMultiplier,
            t,
            attackTime / 1000
          );
          gain.gain.setTargetAtTime(
            layer.volumeMultiplier * sustainLevel,
            t + attackTime / 1000 + decayTime / 1000,
            decayTime / 1000
          );
        }
      });
    }, currentPattern.tempo);
  }

  // Toggle music on/off
  const toggleMusic = () => {
    if (settings.calmMusicEnabled) {
      stopMusic();
      setCalmMusicEnabled(false);
    } else {
      setCalmMusicEnabled(true);
    }
  };

  // Handle play/pause
  useEffect(() => {
    if (!settings.calmMusicEnabled) {
      stopMusic();
      return;
    }

    if (!isPlaying && currentPattern) {
      startMusic();
    }

    return () => {
      stopMusic();
    };
  }, [settings.calmMusicEnabled, currentPattern, isPlaying]);

  // Update volume
  useEffect(() => {
    if (masterGainRef.current && contextRef.current && currentPattern) {
      masterGainRef.current.gain.setTargetAtTime(
        (settings.appVolume / 100) * currentPattern.volume,
        contextRef.current.currentTime,
        0.2
      );
    }
  }, [settings.appVolume, currentPattern]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Main Button */}
      <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-white/95 to-white/85 shadow-soft backdrop-blur overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPanel(!showPanel)}
          className="w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-2"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">
              {settings.calmMusicEnabled ? '🎵' : '🔇'}
            </span>
            <span className="hidden sm:inline">
              {settings.calmMusicEnabled
                ? `${categoryEmojis[currentCategory]} ${categoryLabels[currentCategory]}`
                : 'Music Off'}
            </span>
          </span>
          <span className="text-xs text-slate-500">⚙️</span>
        </button>

        {/* Control Panel */}
        {showPanel && (
          <div className="border-t border-slate-200/50 px-3 py-3 space-y-3 bg-slate-50/80 max-w-sm">
            {/* Play/Pause */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleMusic}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  settings.calmMusicEnabled
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                }`}
              >
                {settings.calmMusicEnabled ? '▶️ Playing' : '⏸️ Paused'}
              </button>
            </div>

            {/* Category Selector */}
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-2">
                🎼 Music Mode
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(Object.keys(categoryLabels) as MusicCategory[]).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCurrentCategory(cat);
                        if (settings.calmMusicEnabled) {
                          setIsPlaying(false);
                        }
                      }}
                      className={`px-2 py-2 text-xs rounded transition-all font-medium ${
                        currentCategory === cat
                          ? 'bg-slate-700 text-white scale-105'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                      title={categoryLabels[cat]}
                    >
                      <span className="block">{categoryEmojis[cat]}</span>
                      <span className="hidden sm:block text-[10px]">
                        {cat}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Volume Control */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
                <span>🔊 Volume</span>
                <span className="text-slate-500">{settings.appVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.appVolume}
                onChange={(e) => {
                  // Note: setAppVolume would need to be added to AppSettingsProvider
                  const event = new CustomEvent('app-volume-change', {
                    detail: { volume: parseInt(e.target.value, 10) }
                  });
                  window.dispatchEvent(event);
                }}
                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-700"
              />
            </div>

            {/* Info */}
            {currentPattern && (
              <div className="pt-2 border-t border-slate-200">
                <div className="text-xs text-slate-600">
                  <p className="font-semibold mb-1">{currentPattern.name}</p>
                  <p className="text-slate-500">{currentPattern.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {currentPattern.gradeRange} grades
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Minimized Indicator when Panel Hidden */}
      {!showPanel && settings.calmMusicEnabled && (
        <div className="mt-2 text-xs text-slate-600 text-center animate-pulse">
          🎵 Playing
        </div>
      )}
    </div>
  );
}
