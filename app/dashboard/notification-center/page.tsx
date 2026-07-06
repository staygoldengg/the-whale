'use client';

import { useEffect, useState } from 'react';

export default function NotificationCenterPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch('/api/schoolos/notifications').then(r=>r.json()).then(j=>setItems(j.notifications ?? [])); }, []);
  return <main className="space-y-6"><section className="whale-panel p-6"><p className="text-sm font-bold uppercase tracking-wide text-whale-700">Operations reminders</p><h1 className="text-3xl font-black">Notification Center</h1><p className="mt-2 text-slate-600">Unresolved reminders, approvals, and school operations alerts.</p></section><section className="grid gap-3">{items.length ? items.map((n)=><article key={n.id} className="whale-panel p-4"><div className="flex items-center justify-between gap-3"><h2 className="font-black text-slate-950">{n.title}</h2><span className="rounded-full bg-whale-100 px-3 py-1 text-xs font-bold text-whale-800">{n.priority}</span></div><p className="mt-2 text-sm text-slate-600">{n.body}</p></article>) : <div className="whale-panel p-6">No unresolved notifications.</div>}</section></main>;
}
