import Link from 'next/link';

export function TopNav() {
  return (
    <header className="border-b border-white/70 bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <Link href="/dashboard" className="flex items-center gap-3 whitespace-nowrap font-black text-whale-900">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-whale-700 text-white">🐋</span>
          The Whale
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600 sm:gap-3">
          <Link href="/dashboard" className="whitespace-nowrap hover:text-whale-800">Dashboard</Link>
          <Link href="/dashboard/teacher-tips" className="whitespace-nowrap hover:text-whale-800">Teacher Tips</Link>
          <Link href="/dashboard/ai-index" className="whitespace-nowrap hover:text-whale-800">AI Index</Link>
          <Link href="/dashboard/settings" className="whitespace-nowrap hover:text-whale-800">Settings</Link>
          <Link href="/dashboard/live-updates" className="whitespace-nowrap hover:text-whale-800">Updates</Link>
          <Link href="/login" className="whitespace-nowrap rounded-xl bg-slate-100 px-3 py-2 hover:bg-slate-200">Login</Link>
        </nav>
      </div>
    </header>
  );
}
