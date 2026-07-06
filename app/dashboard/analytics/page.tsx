'use client';

import { useEffect, useState } from 'react';

const labels: Record<string,string> = { analyticsEvents:'Tracked events', contentReviews:'Content reviews', lessonPlans:'Lesson plans', resources:'Resources', feedbackItems:'Feedback items', approvedReviews:'Approved reviews', pendingResources:'Pending resources', openFeedback:'Open feedback' };

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { fetch('/api/schoolos/analytics').then(async r=>{const j=await r.json(); if(!r.ok) throw new Error(j.error); setData(j);}).catch(e=>setError(e.message)); }, []);
  return <main className="space-y-6"><section className="whale-panel p-6"><p className="text-sm font-bold uppercase tracking-wide text-whale-700">Admin insight</p><h1 className="text-3xl font-black">The Whale Analytics</h1><p className="mt-2 text-slate-600">Thirty-day usage and operations summary for adoption, approvals, lesson planning, resources, and staff feedback.</p></section>{error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}{!data && !error && <div className="whale-panel p-6">Loading analytics...</div>}{data && <section className="grid gap-4 md:grid-cols-4">{Object.entries(data.counts).map(([k,v])=><div key={k} className="whale-panel p-5"><p className="text-sm text-slate-500">{labels[k] ?? k}</p><p className="mt-2 text-3xl font-black text-slate-950">{String(v)}</p></div>)}</section>}</main>;
}
