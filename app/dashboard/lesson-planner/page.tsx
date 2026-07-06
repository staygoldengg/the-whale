'use client';

import { useState } from 'react';

export default function LessonPlannerPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true); setError(null); setResult(null);
    const payload = {
      classroom: String(formData.get('classroom') ?? ''),
      ageGroup: String(formData.get('ageGroup') ?? ''),
      theme: String(formData.get('theme') ?? ''),
      weekOf: String(formData.get('weekOf') ?? ''),
      developmentalGoals: String(formData.get('goals') ?? '').split(',').map((x) => x.trim()).filter(Boolean),
      materials: String(formData.get('materials') ?? '').split(',').map((x) => x.trim()).filter(Boolean),
      notes: String(formData.get('notes') ?? '')
    };
    try {
      const res = await fetch('/api/schoolos/lesson-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Lesson plan failed');
      setResult(json);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  return <main className="space-y-6">
    <section className="whale-panel p-6"><p className="text-sm font-bold uppercase tracking-wide text-whale-700">Teacher workflow</p><h1 className="text-3xl font-black">Guided Lesson Planner</h1><p className="mt-2 text-slate-600">Creates a School Brain-informed plan and runs quality checks before saving.</p></section>
    <form action={submit} className="whale-panel grid gap-4 p-6 md:grid-cols-2">
      <Field name="classroom" label="Classroom" placeholder="Pre-K" />
      <Field name="ageGroup" label="Age group" placeholder="4-5 years" />
      <Field name="theme" label="Weekly theme" placeholder="Ocean Helpers" />
      <Field name="weekOf" label="Week of" placeholder="2026-07-06" />
      <Field name="goals" label="Developmental goals" placeholder="fine motor, sharing, letter O" />
      <Field name="materials" label="Materials" placeholder="crayons, paper plates, glue" />
      <label className="md:col-span-2"><span className="text-sm font-bold text-slate-700">Notes</span><textarea name="notes" className="mt-1 min-h-28 w-full rounded-2xl border border-whale-100 p-3" placeholder="Any school-specific instructions or constraints." /></label>
      <button disabled={loading} className="md:col-span-2 rounded-2xl bg-whale-700 px-5 py-3 font-black text-white disabled:opacity-60">{loading ? 'Building...' : 'Build lesson plan'}</button>
    </form>
    {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}
    {result && <section className="whale-panel p-6"><div className="mb-4 flex flex-wrap items-center gap-3"><span className="rounded-full bg-whale-100 px-3 py-1 text-sm font-bold text-whale-800">Quality {result.qualityScore}/100</span><span className="text-sm font-bold text-slate-600">{result.qualityLabel}</span></div><pre className="whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm text-slate-800 ring-1 ring-slate-100">{result.lessonPlan.plan.content}</pre></section>}
  </main>;
}

function Field({ name, label, placeholder }: { name:string; label:string; placeholder:string }) {
  return <label><span className="text-sm font-bold text-slate-700">{label}</span><input name={name} required className="mt-1 w-full rounded-2xl border border-whale-100 p-3" placeholder={placeholder} /></label>;
}
