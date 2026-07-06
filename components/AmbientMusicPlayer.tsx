'use client';

import { useEffect, useRef } from 'react';
import { useAppSettings } from './AppSettingsProvider';

const pattern = [261.63, 329.63, 392.0, 349.23, 293.66, 329.63, 440.0, 392.0];

export function AmbientMusicPlayer() {
  const { settings, setCalmMusicEnabled } = useAppSettings();
  const contextRef = useRef<AudioContext | null>(null);
  const leadRef = useRef<OscillatorNode | null>(null);
  const padRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const stepRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  function stopMusic() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    leadRef.current?.stop();
    padRef.current?.stop();
    leadRef.current?.disconnect();
    padRef.current?.disconnect();
    gainRef.current?.disconnect();
    leadRef.current = null;
    padRef.current = null;
    gainRef.current = null;
    contextRef.current?.close();
    contextRef.current = null;
  }

  function startMusic() {
    if (contextRef.current) return;

    const audioContext = new window.AudioContext();
    const gain = audioContext.createGain();
    gain.gain.value = (settings.appVolume / 100) * 0.16;

    const lead = audioContext.createOscillator();
    lead.type = 'triangle';
    lead.frequency.value = pattern[0];

    const pad = audioContext.createOscillator();
    pad.type = 'sine';
    pad.frequency.value = pattern[0] / 2;

    lead.connect(gain);
    pad.connect(gain);
    gain.connect(audioContext.destination);

    lead.start();
    pad.start();

    contextRef.current = audioContext;
    leadRef.current = lead;
    padRef.current = pad;
    gainRef.current = gain;

    timerRef.current = window.setInterval(() => {
      if (!leadRef.current || !padRef.current || !contextRef.current) return;
      stepRef.current = (stepRef.current + 1) % pattern.length;
      const frequency = pattern[stepRef.current];
      const t = contextRef.current.currentTime;
      leadRef.current.frequency.setTargetAtTime(frequency, t, 0.35);
      padRef.current.frequency.setTargetAtTime(frequency / 2, t, 0.5);
    }, 2400);
  }

  useEffect(() => {
    if (!settings.calmMusicEnabled) {
      stopMusic();
      return;
    }
    startMusic();

    return () => {
      stopMusic();
    };
  }, [settings.calmMusicEnabled]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = (settings.appVolume / 100) * 0.16;
    }
  }, [settings.appVolume]);

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-soft backdrop-blur">
      <button
        type="button"
        onClick={() => setCalmMusicEnabled(!settings.calmMusicEnabled)}
        className="text-sm font-semibold text-slate-700"
      >
        {settings.calmMusicEnabled ? 'Pause Calm Music' : 'Play Calm Music'}
      </button>
    </div>
  );
}
