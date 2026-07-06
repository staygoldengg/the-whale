'use client';

import { useEffect, useState } from 'react';

export function GuestModeBadge() {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsGuest(document.cookie.includes('guest=true'));
  }, []);

  if (!isGuest) {
    return null;
  }

  return (
    <div className="fixed left-4 top-4 z-50 rounded-2xl border border-whale-200 bg-white/95 px-4 py-2 text-sm font-semibold text-whale-900 shadow-soft backdrop-blur">
      Guest Mode Active
    </div>
  );
}
