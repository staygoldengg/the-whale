'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TeacherWorkspacePage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/schoolos/dashboard?mode=teacher').then(async (r) => {
      const json = await r.json();
      if (!r.ok) throw new Error(json.error ?? 'Failed to load teacher workspace');
      setData(json);
    }).catch((err) => setError(err.message));
  }, []);

  return (
    <main className="space-y-6">
      <section className="whale-panel p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-whale-700">Teacher OS</p>
        <h1 className="text-3xl font-black text-slate-950">Today’s Classroom Workspace</h1>
        <p className="mt-2 text-slate-600">Schedule, live notices, lesson plans, resources, and parent-message prep in one low-click view.</p>
      </section>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}
      {!data && !error && <div className="whale-panel p-6">Loading teacher workspace...</div>}
      {data && <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="Today’s schedule" items={data.todaySchedule} empty="No schedule entries yet." render={(x:any) => `${x.start_time}–${x.end_time} • ${x.staff_name} • ${x.classroom}`} />
        <Panel title="Live updates" items={data.liveUpdates} empty="No updates." render={(x:any) => `${x.priority}: ${x.title}`} />
        <Panel title="Recent lesson plans" items={data.recentLessonPlans} empty="No lesson plans yet." render={(x:any) => `${x.week_of ?? ''} • ${x.theme} • ${x.status}`} />
        <Panel title="Approved resources" items={data.resources} empty="No approved resources yet." render={(x:any) => `${x.category}: ${x.title}`} />
      </section>}
      <section className="flex flex-wrap gap-3">
        <Link href="/dashboard/lesson-planner" className="rounded-xl bg-whale-700 px-4 py-2 font-bold text-white">Build weekly lesson plan</Link>
        <Link href="/dashboard/parent-messages" className="rounded-xl bg-white px-4 py-2 font-bold text-whale-800 ring-1 ring-whale-100">Draft parent message</Link>
      </section>
    </main>
  );
}

function Panel({ title, items, empty, render }: { title:string; items:any[]; empty:string; render:(item:any)=>string }) {
  return <div className="whale-panel p-5"><h2 className="text-lg font-black text-slate-950">{title}</h2><div className="mt-3 space-y-2">{items?.length ? items.map((item, i) => <div key={item.id ?? i} className="rounded-xl bg-white/70 p-3 text-sm text-slate-700 ring-1 ring-slate-100">{render(item)}</div>) : <p className="text-sm text-slate-500">{empty}</p>}</div></div>;
}
