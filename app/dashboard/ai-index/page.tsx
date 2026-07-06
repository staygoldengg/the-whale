import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function AiIndexPage(){
  const { data: items } = await supabaseAdmin.from('ai_index_items').select('id,title,category,tags,age_group,approved,content').order('category').limit(100);
  return <section className="space-y-6"><div className="whale-panel p-6"><h1 className="text-3xl font-black">AI Index Library</h1><p className="mt-2 text-slate-600">Approved school practices and templates The Whale searches before generating new answers.</p></div><div className="grid gap-4 md:grid-cols-2">{items?.map((item:any)=><article key={item.id} className="whale-panel p-5"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-whale-100 px-3 py-1 text-xs font-bold text-whale-800">{item.category}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{item.age_group ?? 'Any age'}</span></div><h2 className="mt-3 text-lg font-bold">{item.title}</h2><p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">{item.content}</p></article>)}</div></section>
}
