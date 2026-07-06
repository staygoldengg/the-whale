'use client';

import { useEffect, useState } from 'react';
import { CoverArt } from './CoverArt';
import { useAppSettings } from './AppSettingsProvider';

export function LaunchSplash() {
  const { settings } = useAppSettings();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!settings.showLaunchSplash) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [settings.showLaunchSplash]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/75 px-5 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl">
        <div className="relative p-6 sm:p-8">
          <CoverArt className="h-72 w-full rounded-[1.5rem] border border-slate-200 bg-slate-100" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
        </div>

        <div className="space-y-3 px-6 pb-7 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-whale-700">The Whale Launch</p>
          <h2 className="text-3xl font-black text-slate-950">Welcome to your personalized dashboard</h2>
          <p className="max-w-2xl text-sm text-slate-600">Guest mode is active, AI tips are ready, and your preferred settings are loaded for this session.</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="button" onClick={() => setOpen(false)} className="whale-button">Enter Dashboard</button>
            <button type="button" onClick={() => setOpen(false)} className="whale-muted-button">Skip</button>
          </div>
        </div>
      </div>
    </div>
  );
}
