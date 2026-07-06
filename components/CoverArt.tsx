'use client';

import { useState } from 'react';

export function CoverArt({ className = '' }: { className?: string }) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className={className}>
      <img
        src="/cover-art.png"
        alt="The Whale cover art"
        className="h-full w-full rounded-[1.75rem] object-cover"
        onError={() => setVisible(false)}
      />
    </div>
  );
}
