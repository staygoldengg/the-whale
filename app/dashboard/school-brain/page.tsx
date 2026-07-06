'use client';

import { useState } from 'react';

export default function SchoolBrainPage() {
  const [query, setQuery] = useState('');
  const [classroom, setClassroom] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function search() {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/school-brain/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, classroom: classroom || undefined }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Search failed');
      setResult(data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  return <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
    <section className="whale-panel p-6 space-y-4">
      <div><p className="text-sm font-bold uppercase tracking-wide text-whale-700">The Whale School Brain</p><h1 className="mt-1 text-3xl font-black">Central knowledge engine</h1></div>
      <label className="block space-y-2"><span className="whale-label">Search request</span><textarea className="whale-input min-h-32" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Example: Tomorrow parent message, Ocean Week, Turtle classroom" /></label>
      <label className="block space-y-2"><span className="whale-label">Classroom filter</span><input className="whale-input" value={classroom} onChange={e=>setClassroom(e.target.value)} placeholder="Turtle classroom" /></label>
      <button className="whale-button w-full" onClick={search} disabled={loading}>{loading ? 'Searching...' : 'Search School Brain'}</button>
      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    </section>
    <section className="whale-panel p-6">
      <h2 className="text-xl font-bold">Context returned</h2>
      {result ? <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-white">{result.formattedContext}</pre> : <p className="mt-4 text-slate-600">This is the shared source-of-truth every Whale tool can consult before generating content.</p>}
    </section>
  </div>;
}
