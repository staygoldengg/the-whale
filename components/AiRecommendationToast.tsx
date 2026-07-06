'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { teacherTips } from '@/lib/teacherTips';
import { useAppSettings } from './AppSettingsProvider';

export function AiRecommendationToast() {
  const [active, setActive] = useState(0);
  const { settings } = useAppSettings();
  const suggestion = teacherTips[active];

  useEffect(() => {
    const interval = setInterval(() => {
      if (settings.tipRotationMode === 'random') {
        setActive(Math.floor(Math.random() * teacherTips.length));
      } else {
        setActive((current) => (current + 1) % teacherTips.length);
      }
    }, settings.tipRotationSeconds * 1000);
    return () => clearInterval(interval);
  }, [settings.tipRotationMode, settings.tipRotationSeconds]);

  return (
    <div className="whale-panel rounded-[2rem] border-whale-200 bg-gradient-to-r from-whale-100 via-white to-whale-100 p-6 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-whale-700">AI suggestion {active + 1}/{teacherTips.length}</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{suggestion.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{suggestion.detail}</p>
        </div>
        <Link
          href={suggestion.href}
          className="whale-button inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold"
        >
          {suggestion.cta}
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
        {teacherTips.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            className={`rounded-full px-3 py-1 transition ${index === active ? 'bg-whale-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Tip {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
