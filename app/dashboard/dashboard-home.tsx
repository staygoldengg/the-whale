'use client';

import Link from 'next/link';
import { AiRecommendationToast } from '@/components/AiRecommendationToast';
import { CertificationPoints } from '@/components/CertificationPoints';
import { useAppSettings } from '@/components/AppSettingsProvider';
import { dashboardShortcuts } from '@/lib/dashboardShortcuts';

export default function DashboardHome() {
  const { settings } = useAppSettings();
  const pinned = dashboardShortcuts.filter((item) => settings.pinnedShortcutIds.includes(item.id));

  return (
    <div className="space-y-6">
      <section className="whale-panel p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-whale-700">AI companion</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">Welcome, {settings.dashboardDisplayName}</h1>
            <p className="mt-3 max-w-3xl text-slate-600">{settings.dashboardSubtitle}</p>
          </div>
          <div className="rounded-3xl bg-whale-100 px-5 py-4 text-right text-sm font-semibold text-whale-900">Guest mode enabled</div>
        </div>
      </section>

      {pinned.length > 0 && (
        <section className="whale-panel p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-whale-700">My Shortcuts</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {pinned.map((item) => (
              <Link key={item.id} href={item.href} className="whale-muted-button text-sm">
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <AiRecommendationToast />

      <section className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="whale-panel p-7">
          <h2 className="text-2xl font-black text-slate-950">Teacher tips tab</h2>
          <div className="mt-4 space-y-4 text-slate-600">
            <p>Your dedicated Teacher Tips tab now rotates 30 practical recommendations to keep classroom planning fresh.</p>
            <p>Open it anytime to cycle through ideas for communication, lesson design, and school operations.</p>
            <Link href="/dashboard/teacher-tips" className="whale-button mt-2">Open Teacher Tips Tab</Link>
          </div>
        </div>

        <CertificationPoints />
      </section>
    </div>
  );
}
