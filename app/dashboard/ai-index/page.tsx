import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { appBaseIndexItems } from '@/lib/appIndex';
import type { AiIndexItem } from '@/lib/types';
import { AiIndexBoard } from '@/components/AiIndexBoard';

export default async function AiIndexPage(){
  const { data } = await supabaseAdmin
    .from('ai_index_items')
    .select('id,title,category,tags,age_group,approved,content,created_by,created_at')
    .order('category')
    .limit(100);

  const seen = new Set<string>();
  const merged: AiIndexItem[] = [...appBaseIndexItems, ...((data ?? []) as AiIndexItem[])].filter((item) => {
    const key = `${item.title}::${item.category}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return <AiIndexBoard items={merged} />;
}
