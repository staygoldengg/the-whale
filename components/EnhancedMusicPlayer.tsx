'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, Volume1, RotateCcw, Settings } from 'lucide-react';
import { musicEngine, DYNAMIC_MUSIC_PATTERNS, DynamicMusicPattern } from '@/lib/dynamicMusicEngine';

export interface EnhancedMusicPlayerProps {
  className?: string;
  compact?: boolean;
  showSettings?: boolean;
}

export function EnhancedMusicPlayer({
  className = '',
  compact = false,
  showSettings = true
}: EnhancedMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<string>('FOCUS_STUDY');
  const [volume, setVolume] = useState(0.3);
  const [showPatternSelect, setShowPatternSelect] = useState(false);
  const patternKeys = Object.keys(DYNAMIC_MUSIC_PATTERNS) as Array<keyof typeof DYNAMIC_MUSIC_PATTERNS>;

  const handlePatternPlay = async (patternKey: string) => {
    if (isPlaying && currentPattern === patternKey) {
      // Stop current playback
      musicEngine.stop();
      setIsPlaying(false);
    } else {
      // Start new pattern
      setCurrentPattern(patternKey);
      await musicEngine.play(patternKey, volume);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    musicEngine.stop();
    setIsPlaying(false);
  };

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    if (isPlaying) {
      // Restart with new volume
      musicEngine.stop();
      await musicEngine.play(currentPattern, newVolume);
    }
  };

  const pattern = DYNAMIC_MUSIC_PATTERNS[currentPattern as keyof typeof DYNAMIC_MUSIC_PATTERNS];

  if (compact) {
    return (
      <div className={`rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-3 border border-blue-100 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => handlePatternPlay(currentPattern)}
            className={`p-2 rounded-lg transition-all ${
              isPlaying
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
          </button>

          <div className="flex-1 h-1 bg-blue-200 rounded-full cursor-pointer group">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all group-hover:shadow-lg"
              style={{ width: `${volume * 100}%` }}
            />
          </div>

          <span className="text-xs font-semibold text-gray-700">{pattern.emoji}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-black/20 px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Music size={16} /> Dynamic Music Engine
          </h3>
          {showSettings && (
            <button
              onClick={() => setShowPatternSelect(!showPatternSelect)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              title="Pattern selection"
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Current Pattern Display */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
          <p className="text-xs text-white/80 uppercase tracking-wider mb-1">Current Pattern</p>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{pattern.emoji}</div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">{pattern.name}</h4>
              <p className="text-xs text-white/70">{pattern.description}</p>
              <div className="mt-2 flex gap-2 text-xs text-white/60">
                <span>♪ {pattern.baseTempo} BPM</span>
                <span>•</span>
                <span>{pattern.intensity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Play Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePatternPlay(currentPattern)}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={16} className="inline mr-1" /> Pause
              </>
            ) : (
              <>
                <Play size={16} className="inline mr-1 fill-current" /> Play
              </>
            )}
          </button>

          <button
            onClick={handleStop}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-all"
            disabled={!isPlaying}
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <label className="text-xs text-white/80 uppercase tracking-wider font-semibold flex items-center gap-2">
            <Volume2 size={14} /> Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg cursor-pointer appearance-none"
            style={{
              background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${
                volume * 100
              }%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>Silent</span>
            <span>{Math.round(volume * 100)}%</span>
            <span>Loud</span>
          </div>
        </div>

        {/* Pattern Selection (Collapsible) */}
        {showPatternSelect && (
          <div className="space-y-2 pt-4 border-t border-white/20">
            <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">Select Pattern</p>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {patternKeys.map((key) => {
                const p = DYNAMIC_MUSIC_PATTERNS[key];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentPattern(key);
                      setShowPatternSelect(false);
                    }}
                    className={`p-3 rounded-lg transition-all text-left text-xs font-semibold ${
                      currentPattern === key
                        ? 'bg-white/30 border-2 border-white text-white'
                        : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-lg mb-1">{p.emoji}</div>
                    <div className="truncate">{p.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-white/60 text-center pt-2">
          Duration: {Math.round(pattern.duration)}s • Mode: {pattern.mode}
        </div>
      </div>
    </div>
  );
}
