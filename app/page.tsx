import Link from 'next/link';
import { CoverArt } from '@/components/CoverArt';

export default function HomePage() {
  return (
    <main className="whale-shell min-h-screen p-6">
      <div className="relative">
        <div className="absolute right-6 top-6 rounded-3xl bg-white/90 p-3 shadow-soft backdrop-blur">
          <Link href="/login" className="whale-muted-button text-sm px-4 py-2">Staff Login</Link>
        </div>
        <section className="mx-auto max-w-3xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-whale-700 text-4xl text-white">🐋</div>
          <p className="font-semibold uppercase tracking-wide text-whale-700">Westhampton Day School AI Companion</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">The Whale</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Generate preschool-safe theme weeks, coloring page prompts, parent messages, team emails, anonymous polls, schedules, and live updates. Built to work alongside Brightwheel, not replace it.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="whale-button">Open Dashboard</Link>
            <Link href="/login" className="whale-muted-button">Staff Login</Link>
          </div>
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-whale-700">Guest mode first</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Open the app in base mode</h2>
            <p className="mt-3 text-slate-600">Use The Whale immediately as a guest. Staff login is available when you want to save work, access personalized AI suggestions, and connect the certification tracker.</p>
          </div>
          <div className="mt-8">
            <CoverArt className="mx-auto h-64 w-full max-w-3xl rounded-[1.75rem] border border-slate-200 bg-slate-100" />
          </div>
        </section>
      </div>
    </main>
  );
}
