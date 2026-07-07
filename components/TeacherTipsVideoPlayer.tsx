'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';

export interface TeacherTip {
  id: string;
  title: string;
  category: string;
  duration: number; // in seconds
  videoUrl: string;
  thumbnail?: string;
  description: string;
  keywords: string[];
}

export interface TeacherTipsVideoPlayerProps {
  tip: TeacherTip;
  onClose?: () => void;
  autoplay?: boolean;
  loop?: boolean;
}

export function TeacherTipsVideoPlayer({
  tip,
  onClose,
  autoplay = false,
  loop = false
}: TeacherTipsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / tip.duration) * 100;

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden shadow-xl group"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={tip.videoUrl}
        poster={tip.thumbnail}
        loop={loop}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => !loop && setIsPlaying(false)}
        className="w-full h-full bg-black"
      />

      {/* Gradient Overlay (bottom) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        {/* Progress Bar */}
        <div className="mb-3 cursor-pointer group/progress">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden hover:h-2 transition-all">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={20} className="fill-current" />
              ) : (
                <Play size={20} className="fill-current" />
              )}
            </button>

            <button
              onClick={handleToggleMute}
              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <span className="text-white text-xs ml-2">
              {formatTime(currentTime)} / {formatTime(tip.duration)}
            </span>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Fullscreen"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Close Button (top-right) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      )}

      {/* Metadata */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold text-sm">{tip.title}</h3>
        <p className="text-gray-300 text-xs">{tip.category}</p>
      </div>
    </div>
  );
}

/**
 * Teacher Tips Column Component - displays rotating tips and video player
 */
export interface TeacherTipsColumnProps {
  tips: TeacherTip[];
  className?: string;
}

export function TeacherTipsColumn({ tips, className = '' }: TeacherTipsColumnProps) {
  const [selectedTip, setSelectedTip] = useState<TeacherTip | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  if (!tips || tips.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 ${className}`}>
        <div className="text-center text-gray-500">
          <p className="font-semibold">No teacher tips available</p>
        </div>
      </div>
    );
  }

  const tip = tips[currentTipIndex];

  return (
    <div
      className={`bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl border border-blue-100 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h2 className="text-white font-bold text-sm flex items-center gap-2">
          <span>💡</span> Teacher Tips & Ideas
        </h2>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Current Tip */}
        <div className="bg-white rounded-lg p-3 border-l-4 border-blue-500">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            {tip.category}
          </p>
          <h3 className="text-sm font-bold text-gray-900 mb-2">{tip.title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">{tip.description}</p>

          {/* Video Thumbnail */}
          {tip.videoUrl && (
            <button
              onClick={() => setSelectedTip(tip)}
              className="w-full rounded-lg overflow-hidden mb-3 group relative h-24 bg-gray-200 hover:shadow-md transition-shadow"
            >
              {tip.thumbnail && (
                <img
                  src={tip.thumbnail}
                  alt={tip.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                <Play size={24} className="text-white fill-white" />
              </div>
            </button>
          )}

          {/* Keywords */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tip.keywords.slice(0, 3).map(keyword => (
              <span
                key={keyword}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentTipIndex((i) => (i - 1 + tips.length) % tips.length)
            }
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-gray-600 font-medium">
            {currentTipIndex + 1} / {tips.length}
          </span>
          <button
            onClick={() => setCurrentTipIndex((i) => (i + 1) % tips.length)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedTip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <TeacherTipsVideoPlayer
              tip={selectedTip}
              onClose={() => setSelectedTip(null)}
              autoplay
            />
          </div>
        </div>
      )}
    </div>
  );
}
