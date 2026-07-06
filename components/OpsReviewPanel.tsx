'use client';

import { useState } from 'react';
import { CopyButton } from './CopyButton';

export function OpsReviewPanel({ initialContent = '', contentType = 'general' }: { initialContent?: string; contentType?: string }) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState('The Whale Draft');
  const [review, setReview] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [error, setError] = useState('');

  async function runReview() {
    setLoading(true); setError(''); setReview(null); setDoc(null);
    try {
      const res = await fetch('/api/ops/review', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content, contentType }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Review failed');
      setReview(data);
    } catch (e:any) { setError(e.message ?? 'Review failed'); }
    finally { setLoading(false); }
  }

  async function exportDoc() {
    const exportContent = review?.brightwheelReady || content;
    setDocLoading(true); setError(''); setDoc(null);
    try {
      const res = await fetch('/api/google/docs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, content: exportContent, reviewId: review?.savedId }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Export failed');
      setDoc(data);
    } catch (e:any) { setError(e.message ?? 'Export failed'); }
    finally { setDocLoading(false); }
  }

  return <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
    <section className="whale-panel space-y-5 p-6">
      <div><p className="text-sm font-bold uppercase tracking-wide text-whale-700">Operations Safety</p><h1 className="mt-1 text-3xl font-black">Review before Brightwheel</h1><p className="mt-2 text-slate-600">Paste any parent message, staff email, schedule note, or weekly plan. The Whale checks tone, privacy, staff references, pronouns, and Brightwheel readiness.</p></div>
      <label className="block space-y-2"><span className="whale-label">Google Docs title</span><input className="whale-input" value={title} onChange={(e)=>setTitle(e.target.value)} /></label>
      <label className="block space-y-2"><span className="whale-label">Draft content</span><textarea className="whale-input min-h-80" value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Paste or write the message here..." /></label>
      <div className="flex flex-wrap gap-2"><button className="whale-button" onClick={runReview} disabled={loading || !content.trim()}>{loading?'Reviewing...':'Run safety review'}</button><button className="whale-muted-button" onClick={exportDoc} disabled={docLoading || !content.trim()}>{docLoading?'Exporting...':'Send to Google Docs'}</button></div>
      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
    </section>
    <section className="whale-panel space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Review Result</h2>{review?.brightwheelReady && <CopyButton text={review.brightwheelReady} />}</div>
      {review ? <><div className="rounded-2xl bg-slate-950 p-5 text-white"><p className="text-xs font-bold uppercase text-whale-200">Status: {review.status}</p><pre className="mt-3 whitespace-pre-wrap text-sm leading-6">{review.brightwheelReady}</pre></div><div className="space-y-3">{review.issues.map((i:any, idx:number)=><div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="font-bold capitalize">{i.level}: {i.title}</p><p className="mt-1 text-sm text-slate-600">{i.detail}</p>{i.suggestion && <p className="mt-2 text-sm font-semibold text-whale-800">Fix: {i.suggestion}</p>}</div>)}</div></> : <p className="text-slate-600">Review results will appear here.</p>}
      {doc && <div className="rounded-2xl bg-whale-50 p-4 text-sm"><p className="font-bold text-whale-900">Google Docs export</p>{doc.configured && doc.url ? <a className="mt-1 block text-whale-800 underline" href={doc.url} target="_blank">Open Google Doc</a> : <p className="mt-1 text-slate-700">{doc.message}</p>}</div>}
    </section>
  </div>;
}
