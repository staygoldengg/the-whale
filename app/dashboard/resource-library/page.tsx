'use client';

import { useEffect, useState } from 'react';

export default function ResourceLibraryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  async function load() { const r = await fetch('/api/schoolos/resources?status=approved'); const j = await r.json(); setItems(j.items ?? []); }
  useEffect(() => { load(); }, []);
  async function submit(formData: FormData) {
    const payload = { title: String(formData.get('title')), category: String(formData.get('category')), ageGroup: String(formData.get('ageGroup') || '') || null, content: String(formData.get('content')), tags: String(formData.get('tags') ?? '').split(',').map((x)=>x.trim()).filter(Boolean), submitForReview: true };
    const r = await fetch('/api/schoolos/resources', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)}); const j = await r.json(); setMessage(r.ok ? 'Resource submitted for approval.' : j.error); if (r.ok) load();
  }
  return <main className="space-y-6"><section className="whale-panel p-6"><p className="text-sm font-bold uppercase tracking-wide text-whale-700">Knowledge Marketplace</p><h1 className="text-3xl font-black">Resource Library</h1><p className="mt-2 text-slate-600">Approved lesson resources, parent messages, crafts, circle time ideas, and school practices that can feed the School Brain.</p></section><form action={submit} className="whale-panel grid gap-4 p-6 md:grid-cols-2"><input name="title" required className="rounded-2xl border border-whale-100 p-3" placeholder="Resource title" /><input name="category" required className="rounded-2xl border border-whale-100 p-3" placeholder="Category" /><input name="ageGroup" className="rounded-2xl border border-whale-100 p-3" placeholder="Age group" /><input name="tags" className="rounded-2xl border border-whale-100 p-3" placeholder="tags, comma, separated" /><textarea name="content" required className="min-h-32 rounded-2xl border border-whale-100 p-3 md:col-span-2" placeholder="Paste the classroom-tested resource." /><button className="rounded-2xl bg-whale-700 px-5 py-3 font-black text-white md:col-span-2">Submit resource</button></form>{message && <div className="whale-panel p-4">{message}</div>}<section className="grid gap-3">{items.map((item)=><article key={item.id} className="whale-panel p-4"><p className="text-sm font-bold text-whale-700">{item.category}</p><h2 className="font-black text-slate-950">{item.title}</h2><p className="mt-2 line-clamp-3 text-sm text-slate-600">{item.content}</p></article>)}</section></main>;
}
