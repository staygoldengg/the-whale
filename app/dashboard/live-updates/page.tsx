import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function UpdatesPage(){
  const { data: updates } = await supabaseAdmin.from('live_updates').select('*').order('created_at',{ascending:false}).limit(25);
  return <section className="space-y-6"><div className="whale-panel p-6"><h1 className="text-3xl font-black">Live School Updates</h1><p className="mt-2 text-slate-600">Staff-facing school reminders, weather notes, events, schedule changes, and drill notices.</p></div><div className="grid gap-4">{updates?.map((u:any)=><article key={u.id} className="whale-panel p-5"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-whale-100 px-3 py-1 text-xs font-bold text-whale-800">{u.update_type}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{u.priority}</span></div><h2 className="mt-3 text-xl font-bold">{u.title}</h2><p className="mt-2 whitespace-pre-wrap text-slate-700">{u.body}</p></article>)}{!updates?.length && <p className="whale-panel p-5 text-slate-600">No updates yet.</p>}</div></section>
}
