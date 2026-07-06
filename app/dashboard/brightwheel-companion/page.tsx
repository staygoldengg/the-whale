'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { OpsReviewPanel } from '@/components/OpsReviewPanel';

const templates = ['Daily Update','Supply Request','Event Reminder','Schedule Change','Weekly Newsletter','Weather Notice','Picture Day','Field Trip Reminder'];

export default function BrightwheelCompanionPage() {
  const [template, setTemplate] = useState('Daily Update');
  const [content, setContent] = useState('');
  const formatted = `Hello families,\n\n${content.trim()}\n\nThank you!`;
  return <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
    <section className="whale-panel p-6 space-y-4">
      <div><p className="text-sm font-bold uppercase tracking-wide text-whale-700">Brightwheel companion mode</p><h1 className="mt-1 text-3xl font-black">Copy-safe parent app formatting</h1></div>
      <label className="block space-y-2"><span className="whale-label">Template</span><select className="whale-input" value={template} onChange={e=>setTemplate(e.target.value)}>{templates.map(t=><option key={t}>{t}</option>)}</select></label>
      <label className="block space-y-2"><span className="whale-label">Message details</span><textarea className="whale-input min-h-40" value={content} onChange={e=>setContent(e.target.value)} placeholder="Paste or draft the key update here." /></label>
      <p className="text-sm text-slate-600">This does not directly post to Brightwheel. It creates reviewed, copy-ready text and records the review status.</p>
    </section>
    <section className="space-y-5">
      <div className="whale-panel p-6">
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{template} preview</h2>{content && <CopyButton text={formatted} />}</div>
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-white">{content ? formatted : 'Your Brightwheel-ready preview will appear here.'}</pre>
      </div>
      {content && <OpsReviewPanel initialContent={formatted} contentType="brightwheel-companion" />}
    </section>
  </div>;
}
