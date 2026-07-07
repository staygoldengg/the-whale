'use client';

import { useEffect, useState } from 'react';

export function GuestModeBadge() {
  const [isGuest, setIsGuest] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsGuest(document.cookie.includes('guest=true'));
  }, []);

  if (!isGuest) {
    return null;
  }

  return (
    <div 
      className="fixed left-4 top-4 z-40 transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`rounded-full border-2 border-emerald-400/50 bg-gradient-to-br from-emerald-50 to-teal-50 px-3 py-2 text-xs font-bold text-emerald-700 shadow-md backdrop-blur-sm transition-all ${
        isHovering ? 'shadow-lg scale-105' : ''
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <span>Guest</span>
        </div>
      </div>
      
      {isHovering && (
        <div className="absolute top-full left-0 mt-2 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg pointer-events-none">
          <div className="font-semibold flex items-center gap-1">📌 Tip: Sign in to save</div>
        </div>
      )}
    </div>
  );
}
