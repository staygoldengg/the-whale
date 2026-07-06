'use client';

import { useEffect } from 'react';
import { TopNav } from '@/components/TopNav';
import { AmbientMusicPlayer } from '@/components/AmbientMusicPlayer';
import { GuestModeBadge } from '@/components/GuestModeBadge';
import { LaunchSplash } from '@/components/LaunchSplash';
import { OnboardingFlow } from '@/components/OnboardingFlow';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!document.cookie.includes('guest=true')) {
      document.cookie = 'guest=true; path=/; max-age=604800; samesite=lax';
    }
  }, []);

  return <div className="whale-shell"><TopNav /><LaunchSplash /><OnboardingFlow /><GuestModeBadge /><main className="mx-auto max-w-7xl px-5 py-8">{children}</main><AmbientMusicPlayer /></div>;
}
