import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="whale-shell flex min-h-screen items-center justify-center p-6">
      <section className="whale-panel max-w-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-whale-700 text-4xl text-white">🐋</div>
        <p className="font-semibold uppercase tracking-wide text-whale-700">Westhampton Day School AI Companion</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">The Whale</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Generate preschool-safe theme weeks, coloring page prompts, parent messages, team emails, anonymous polls, schedules, and live updates. Built to work alongside Brightwheel, not replace it.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="whale-button">Open Dashboard</Link>
          <Link href="/login" className="whale-muted-button">Staff Login</Link>
        </div>
      </section>
    </main>
  );
}
