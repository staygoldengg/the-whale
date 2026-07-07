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
  const [showTooltip, setShowTooltip] = useState(false);
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
      <div className={`rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-3 border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="space-y-2">
          {/* Pattern Display */}
          <div className="text-center">
            <div className="text-3xl mb-1">{pattern.emoji}</div>
            <div className="text-xs font-semibold text-slate-700 truncate">{pattern.name}</div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => handlePatternPlay(currentPattern)}
              className={`flex-1 p-2 rounded-md transition-all font-semibold text-sm ${
                isPlaying
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-current" />}
            </button>
            
            <button
              onClick={() => setShowPatternSelect(!showPatternSelect)}
              className="p-2 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              title="Switch pattern"
            >
              <Settings size={16} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="h-1.5 bg-emerald-200 rounded-full cursor-pointer group">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all group-hover:shadow-md"
              style={{ width: `${volume * 100}%` }}
              onClick={(e) => {
                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                if (rect) handleVolumeChange((e.clientX - rect.left) / rect.width);
              }}
            />
          </div>

          {/* Tooltip */}
          {showTooltip && (
            <div className="text-xs text-slate-600 text-center bg-white/60 rounded px-2 py-1">
              {Math.round(volume * 100)}% • {pattern.intensity}
            </div>
          )}
        </div>
        
        {/* Pattern Select Grid */}
        {showPatternSelect && (
          <div className="mt-3 pt-3 border-t border-emerald-200/50 space-y-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Patterns</p>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {patternKeys.slice(0, 6).map((key) => {
                const p = DYNAMIC_MUSIC_PATTERNS[key];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentPattern(key);
                      setShowPatternSelect(false);
                    }}
                    className={`p-2 rounded-md transition-all text-center text-xs font-semibold ${
                      currentPattern === key
                        ? 'bg-emerald-200 border-2 border-emerald-500 text-emerald-700'
                        : 'bg-white border border-emerald-200 text-slate-600 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="text-lg mb-0.5">{p.emoji}</div>
                    <div className="truncate text-xs leading-tight">{p.name.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-black/15 px-4 py-3 border-b border-white/15">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Music size={16} /> Music Studio
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
        <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
          <p className="text-xs text-white/70 uppercase tracking-wider mb-2 font-semibold">Now Playing</p>
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-pulse">{pattern.emoji}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-sm truncate">{pattern.name}</h4>
              <p className="text-xs text-white/70 line-clamp-2">{pattern.description}</p>
              <div className="mt-2 flex gap-2 text-xs text-white/60">
                <span>♪ {pattern.baseTempo} BPM</span>
                <span>•</span>
                <span className="capitalize">{pattern.intensity}</span>
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
          <div className="space-y-2 pt-3 border-t border-white/20">
            <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Select Pattern</p>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {patternKeys.map((key) => {
                const p = DYNAMIC_MUSIC_PATTERNS[key];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentPattern(key);
                      setShowPatternSelect(false);
                    }}
                    className={`p-2 rounded-lg transition-all text-center text-xs font-semibold ${
                      currentPattern === key
                        ? 'bg-white/30 border-2 border-white text-white shadow-lg'
                        : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                    }`}
                    title={p.name}
                  >
                    <div className="text-lg mb-0.5">{p.emoji}</div>
                    <div className="truncate text-xs leading-tight">{p.name.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="text-xs text-white/50 text-center pt-2 border-t border-white/10">
          <span>⏱ {Math.round(pattern.duration)}s</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{pattern.mode}</span>
        </div>
      </div>
    </div>
  );
}
