import './globals.css';
import PwaInstaller from '@/components/PwaInstaller';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'The Whale — Westhampton Day School AI Companion',
  description: 'A Brightwheel companion dashboard for theme weeks, staff communication, schedules, polls, and live updates.',
  manifest: '/manifest.webmanifest',
  applicationName: 'The Whale',
  icons: {
    icon: [
      { url: '/icons/icon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/icons/icon.ico']
  },
  appleWebApp: {
    capable: true,
    title: 'The Whale',
    statusBarStyle: 'default'
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0f6b8f'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="fixed bottom-4 right-4 z-50 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]">
          <PwaInstaller />
        </div>
      </body>
    </html>
  );
}
