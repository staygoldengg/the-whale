'use client';

import { useEffect } from 'react';
import { TopNav } from '@/components/TopNav';
import { GuestModeBadge } from '@/components/GuestModeBadge';
import { LaunchSplash } from '@/components/LaunchSplash';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { EnhancedMusicPlayer } from '@/components/EnhancedMusicPlayer';
import { UICustomizationPanel } from '@/components/UICustomizationPanel';
import { BrandingFooter } from '@/components/BrandingFooter';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!document.cookie.includes('guest=true')) {
      document.cookie = 'guest=true; path=/; max-age=604800; samesite=lax';
    }
  }, []);

  return (
    <>
      <div className="whale-shell min-h-screen flex flex-col">
        <TopNav />
        <LaunchSplash />
        <OnboardingFlow />
        <GuestModeBadge />
        
        <main className="flex-1 mx-auto max-w-7xl px-5 py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content */}
            <div className="lg:col-span-3">{children}</div>
            
            {/* Right sidebar - Music player and Teacher tips */}
            <div className="lg:col-span-1 space-y-6">
              <EnhancedMusicPlayer compact={false} />
            </div>
          </div>
        </main>

        {/* Customization Panel */}
        <UICustomizationPanel />
      </div>
      
      {/* Branding Footer */}
      <BrandingFooter showBuiltBy showPoweredBy />
    </>
  );
}
