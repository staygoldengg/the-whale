'use client';

import { useState } from 'react';

export default function StaffFeedbackPage() {
  const [message, setMessage] = useState<string | null>(null);
  async function submit(formData: FormData) {
    const payload = {
      feedbackType: String(formData.get('feedbackType')),
      classroom: String(formData.get('classroom') || '') || null,
      title: String(formData.get('title')),
      body: String(formData.get('body')),
      anonymous: formData.get('anonymous') === 'on'
    };
    const res = await fetch('/api/schoolos/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await res.json();
    setMessage(res.ok ? 'Feedback submitted.' : json.error ?? 'Unable to submit.');
  }
  return <main className="space-y-6"><section className="whale-panel p-6"><p className="text-sm font-bold uppercase tracking-wide text-whale-700">Staff voice</p><h1 className="text-3xl font-black">Anonymous Staff Feedback</h1><p className="mt-2 text-slate-600">Collect suggestions, concerns, appreciation, training requests, supply requests, and classroom improvement ideas.</p></section><form action={submit} className="whale-panel grid gap-4 p-6"><select name="feedbackType" className="rounded-2xl border border-whale-100 p-3"><option value="suggestion">Suggestion</option><option value="concern">Workplace concern</option><option value="appreciation">Appreciation</option><option value="training_request">Training request</option><option value="supply_request">Supply request</option><option value="classroom_improvement">Classroom improvement</option></select><input name="classroom" className="rounded-2xl border border-whale-100 p-3" placeholder="Classroom optional" /><input name="title" required className="rounded-2xl border border-whale-100 p-3" placeholder="Short title" /><textarea name="body" required className="min-h-32 rounded-2xl border border-whale-100 p-3" placeholder="Details" /><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="anonymous" defaultChecked /> Submit anonymously</label><button className="rounded-2xl bg-whale-700 px-5 py-3 font-black text-white">Submit feedback</button></form>{message && <div className="whale-panel p-4">{message}</div>}</main>;
}
