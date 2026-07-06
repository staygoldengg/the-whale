'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { teacherTips } from '@/lib/teacherTips';
import { CertificationPoints } from '@/components/CertificationPoints';
import { useAppSettings } from '@/components/AppSettingsProvider';

export default function TeacherTipsPage() {
  const [activeTip, setActiveTip] = useState(0);
  const { settings } = useAppSettings();

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (settings.tipRotationMode === 'random') {
        setActiveTip(Math.floor(Math.random() * teacherTips.length));
      } else {
        setActiveTip((current) => (current + 1) % teacherTips.length);
      }
    }, settings.tipRotationSeconds * 1000);
    return () => window.clearInterval(interval);
  }, [settings.tipRotationMode, settings.tipRotationSeconds]);

  const current = teacherTips[activeTip];

  return (
    <div className="space-y-6">
      <section className="whale-panel p-7">
        <p className="text-sm font-bold uppercase tracking-wide text-whale-700">Teacher Tips</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">30 rotating AI teaching recommendations</h1>
        <p className="mt-3 max-w-3xl text-slate-600">These tips rotate automatically to keep your planning fresh and practical throughout the week.</p>
      </section>

      <section className="whale-panel bg-gradient-to-r from-whale-100 via-white to-whale-100 p-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-whale-700">Now Showing {activeTip + 1}/{teacherTips.length}</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">{current.title}</h2>
        <p className="mt-3 text-slate-700">{current.detail}</p>
        <Link href={current.href} className="whale-button mt-5">{current.cta}</Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {teacherTips.map((tip, index) => (
          <article key={tip.id} className="whale-panel p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-whale-700">Tip {index + 1}</p>
            <h3 className="mt-2 text-lg font-bold text-slate-950">{tip.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{tip.detail}</p>
            <Link href={tip.href} className="mt-4 inline-flex text-sm font-semibold text-whale-700 hover:text-whale-900">{tip.cta} →</Link>
          </article>
        ))}
      </section>

      <CertificationPoints />
    </div>
  );
}
