import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function PollsPage(){
  const { data: polls } = await supabaseAdmin.from('polls').select('id,title,description,poll_type,options,active,created_at').order('created_at',{ascending:false}).limit(20);
  return <section className="space-y-6"><div className="whale-panel p-6"><h1 className="text-3xl font-black">Anonymous Staff Polls</h1><p className="mt-2 text-slate-600">MVP view for anonymous staff feedback. Use the API/table to create polls, then staff responses do not store identity.</p></div><div className="grid gap-4">{polls?.map((p:any)=><article key={p.id} className="whale-panel p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">{p.title}</h2><p className="mt-1 text-slate-600">{p.description}</p></div><span className="rounded-full bg-whale-100 px-3 py-1 text-xs font-bold text-whale-800">{p.active?'Active':'Closed'}</span></div></article>)}{!polls?.length && <p className="whale-panel p-5 text-slate-600">No polls yet.</p>}</div></section>
}
