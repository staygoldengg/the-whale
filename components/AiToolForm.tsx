'use client';

import { useMemo, useState } from 'react';
import { CopyButton } from './CopyButton';
import { OpsReviewPanel } from './OpsReviewPanel';
import type { WhaleTool } from '@/lib/types';

type Field = { name: string; label: string; placeholder?: string; type?: 'input' | 'textarea' | 'select'; options?: string[] };

const toolLabels: Record<WhaleTool, string> = {
  'theme-week': 'Theme Week Generator',
  'coloring-page': 'Coloring Page Prompt Builder',
  'weekly-plan': 'Weekly Plan Builder',
  'parent-message': 'Parent Message Generator',
  'team-email': 'Team Email Generator',
  'theme-analysis': 'Theme Analysis',
  'career-path': 'Employee Career Path Builder',
  'ops-review': 'Operations Review'
};

export function AiToolForm({ tool, fields }: { tool: WhaleTool; fields: Field[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const prompt = useMemo(() => Object.entries(values).map(([k, v]) => `${k}: ${v}`).join('\n'), [values]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setResult(''); setSources([]);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, prompt, metadata: values })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      setResult(data.result);
      setSources(data.sourcesUsed ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submit} className="whale-panel space-y-5 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-whale-700">The Whale</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">{toolLabels[tool]}</h1>
        </div>
        {fields.map((field) => (
          <label key={field.name} className="block space-y-2">
            <span className="whale-label">{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea className="whale-input min-h-28" placeholder={field.placeholder} value={values[field.name] ?? ''} onChange={(e)=>setValues(v=>({...v,[field.name]:e.target.value}))} />
            ) : field.type === 'select' ? (
              <select className="whale-input" value={values[field.name] ?? ''} onChange={(e)=>setValues(v=>({...v,[field.name]:e.target.value}))}>
                <option value="">Select...</option>
                {field.options?.map((o)=><option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input className="whale-input" placeholder={field.placeholder} value={values[field.name] ?? ''} onChange={(e)=>setValues(v=>({...v,[field.name]:e.target.value}))} />
            )}
          </label>
        ))}
        <button className="whale-button w-full" disabled={loading}>{loading ? 'Generating...' : 'Generate Brightwheel-ready copy'}</button>
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
      </form>

      <section className="whale-panel min-h-[32rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Output</h2>
          {result && <div className="flex gap-2"><CopyButton text={result} /><button className="whale-muted-button" onClick={()=>window.print()}>Print</button></div>}
        </div>
        {result ? <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-white">{result}</pre> : <p className="mt-5 text-slate-600">Generated school-ready content will appear here.</p>}
        {sources.length > 0 && (
          <div className="mt-5 rounded-2xl bg-whale-50 p-4">
            <p className="text-sm font-bold text-whale-900">Index sources used</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
              {sources.map((s)=><li key={s.id}>{s.title} · {s.category}</li>)}
            </ul>
          </div>
        )}
      </section>
      {result && <section className="lg:col-span-2"><OpsReviewPanel initialContent={result} contentType={tool} /></section>}
    </div>
  );
}
