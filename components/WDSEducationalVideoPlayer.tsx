'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
  title: string;
  playlistId: string;
  playlistUrl: string;
}

export function WDSEducationalVideoPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(0);

  // Westhampton Day School Educational Playlists
  const playlists: Video[] = [
    {
      title: 'Early Childhood Development',
      playlistId: 'PLwlEmipfEbAKU3cleFpeGt_WNDube8iGk',
      playlistUrl: 'https://youtube.com/playlist?list=PLwlEmipfEbAKU3cleFpeGt_WNDube8iGk'
    },
    {
      title: 'Teaching Strategies & Techniques',
      playlistId: 'PLJbL3nqQWaSwcTkH68zU4OYc5XcB_Kc0r',
      playlistUrl: 'https://youtube.com/playlist?list=PLJbL3nqQWaSwcTkH68zU4OYc5XcB_Kc0r'
    },
    {
      title: 'Professional Development',
      playlistId: 'PLn0lJLtsdotE6M_-zdKtxsYUPuI3qnqA-',
      playlistUrl: 'https://youtube.com/playlist?list=PLn0lJLtsdotE6M_-zdKtxsYUPuI3qnqA-'
    }
  ];

  const currentPlaylist = playlists[selectedPlaylist];
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${currentPlaylist.playlistId}&autoplay=${autoplay ? 1 : 0}`;

  const handlePrevPlaylist = () => {
    setSelectedPlaylist((prev) => (prev === 0 ? playlists.length - 1 : prev - 1));
  };

  const handleNextPlaylist = () => {
    setSelectedPlaylist((prev) => (prev === playlists.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 5000);
    return () => clearTimeout(timer);
  }, [showControls]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center space-y-2 px-4">
        <div className="flex items-center justify-center gap-2">
          <img
            src="https://westhamptondayschool.org/wp-content/uploads/2019/03/wds-logo-horiz.png"
            alt="Westhampton Day School"
            className="h-12 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Professional Learning Videos
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Curated educational content to support your growth as an educator. Explore teaching strategies, child development, and professional excellence.
        </p>
      </div>

      {/* Video Player Container */}
      <div className="relative w-full bg-black/5 backdrop-blur-sm rounded-xl overflow-hidden group">
        {/* Video Embed */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={currentPlaylist.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />

          {/* Overlay Controls */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-between p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* Top Info */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  Playlist {selectedPlaylist + 1} of {playlists.length}
                </div>
                <h3 className="text-white font-bold text-lg drop-shadow-lg">
                  {currentPlaylist.title}
                </h3>
              </div>
              <button
                onClick={() => setAutoplay(!autoplay)}
                className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-colors"
                title="Toggle autoplay"
              >
                <Settings size={18} />
              </button>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevPlaylist}
                className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all transform hover:scale-105"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-white text-center text-sm font-semibold drop-shadow-lg">
                {currentPlaylist.title.split(' ').slice(0, 2).join(' ')}
              </div>

              <button
                onClick={handleNextPlaylist}
                className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all transform hover:scale-105"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Indicators */}
      <div className="flex justify-center gap-2 px-4">
        {playlists.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedPlaylist(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedPlaylist
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 w-8'
                : 'bg-slate-300 hover:bg-slate-400 w-2'
            }`}
            aria-label={`Switch to playlist ${index + 1}`}
          />
        ))}
      </div>

      {/* Playlist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        {playlists.map((playlist, index) => (
          <button
            key={index}
            onClick={() => setSelectedPlaylist(index)}
            className={`group p-4 rounded-xl transition-all duration-300 border-2 ${
              index === selectedPlaylist
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400 shadow-lg'
                : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`text-2xl p-2 rounded-lg transition-colors ${
                index === selectedPlaylist
                  ? 'bg-emerald-200 text-emerald-700'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600'
              }`}>
                {index === 0 ? '👶' : index === 1 ? '📚' : '🎓'}
              </div>
              <div className="text-left">
                <h4 className={`font-bold text-sm transition-colors ${
                  index === selectedPlaylist
                    ? 'text-emerald-900'
                    : 'text-slate-900 group-hover:text-emerald-700'
                }`}>
                  {playlist.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {index === 0 && 'Understanding child development'}
                  {index === 1 && 'Proven teaching methodologies'}
                  {index === 2 && 'Continuous growth resources'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-200/50 rounded-xl p-4 mx-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <p className="text-sm font-semibold text-emerald-900">Learning Tips</p>
        </div>
        <ul className="text-xs text-slate-700 space-y-1 ml-8">
          <li>• Watch videos at your own pace - no rush!</li>
          <li>• Take notes on strategies you can apply immediately</li>
          <li>• Share interesting insights with your team</li>
          <li>• Revisit videos as needed for reference</li>
        </ul>
      </div>
    </div>
  );
}
