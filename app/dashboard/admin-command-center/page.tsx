'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const metricLabels: Record<string,string> = {
  activeStaff: 'Active staff', schedulesThisWeek: 'Schedules this week', pendingReviews: 'Pending reviews', activePolls: 'Active polls', upcomingEvents: 'Upcoming events', pendingResources: 'Pending resources', openTasks: 'Open tasks', trainingDueSoon: 'Training due soon', unresolvedNotifications: 'Notifications'
};

export default function AdminCommandCenterPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/schoolos/dashboard?mode=admin').then(async (r) => {
      const json = await r.json();
      if (!r.ok) throw new Error(json.error ?? 'Failed to load dashboard');
      setData(json);
    }).catch((err) => setError(err.message));
  }, []);

  return (
    <main className="space-y-6">
      <section className="whale-panel p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-whale-700">Administrator OS</p>
        <h1 className="text-3xl font-black text-slate-950">School Command Center</h1>
        <p className="mt-2 text-slate-600">One screen for coverage, approvals, staff feedback, training due dates, resources, events, and live school notices.</p>
      </section>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}
      {!data && !error && <div className="whale-panel p-6">Loading command center...</div>}
      {data && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            {Object.entries(data.summary).map(([key, value]) => (
              <div key={key} className="whale-panel p-5">
                <p className="text-sm text-slate-500">{metricLabels[key] ?? key}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{String(value)}</p>
              </div>
            ))}
          </section>
          <section className="grid gap-5 lg:grid-cols-2">
            <Panel title="Needs attention" items={[...data.reviews, ...data.pendingResources, ...data.tasks].slice(0,8)} getText={(x:any) => x.title ?? x.content_type ?? x.task_title ?? x.status} />
            <Panel title="Today + this week" items={[...data.schedules, ...data.events].slice(0,8)} getText={(x:any) => `${x.date ?? x.event_date ?? ''} ${x.start_time ?? ''} ${x.title ?? x.staff_name ?? ''} ${x.classroom ?? ''}`} />
            <Panel title="Live updates" items={data.updates} getText={(x:any) => `${x.priority}: ${x.title}`} />
            <Panel title="Training due" items={data.trainingDue} getText={(x:any) => `${x.staff_name ?? ''} ${x.item_title ?? x.title ?? ''} ${x.due_date ?? ''}`} />
          </section>
          <section className="flex flex-wrap gap-3">
            <Link href="/dashboard/ops-review" className="rounded-xl bg-whale-700 px-4 py-2 font-bold text-white">Review content</Link>
            <Link href="/dashboard/resource-library" className="rounded-xl bg-white px-4 py-2 font-bold text-whale-800 ring-1 ring-whale-100">Resource library</Link>
            <Link href="/dashboard/staff-feedback" className="rounded-xl bg-white px-4 py-2 font-bold text-whale-800 ring-1 ring-whale-100">Staff feedback</Link>
          </section>
        </>
      )}
    </main>
  );
}

function Panel({ title, items, getText }: { title: string; items: any[]; getText: (item:any)=>string }) {
  return <div className="whale-panel p-5"><h2 className="text-lg font-black text-slate-950">{title}</h2><div className="mt-3 space-y-2">{items?.length ? items.map((item, i) => <div key={item.id ?? i} className="rounded-xl bg-white/70 p-3 text-sm text-slate-700 ring-1 ring-slate-100">{getText(item)}</div>) : <p className="text-sm text-slate-500">Nothing urgent.</p>}</div></div>;
}
