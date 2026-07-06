import OpenAI from 'openai';
import { supabaseAdmin } from './supabaseAdmin';
import type { AiIndexItem, WhaleTool } from './types';
import { getSchoolBrainContext, formatSchoolBrainContext } from './schoolBrain';
import { appBaseIndexItems } from './appIndex';

const categoryMap: Record<WhaleTool, string[]> = {
  'theme-week': ['Theme Weeks', 'Classroom Activities', 'Slogans', 'School Culture'],
  'coloring-page': ['Coloring Page Prompts', 'Theme Weeks', 'Classroom Activities'],
  'weekly-plan': ['Classroom Activities', 'SEL Activities', 'Theme Weeks', 'School Culture'],
  'parent-message': ['Parent Messages', 'School Culture', 'Safety Updates'],
  'team-email': ['Staff Emails', 'School Culture', 'Schedule Notes'],
  'theme-analysis': ['Theme Weeks', 'School Culture', 'Slogans'],
  'career-path': ['Staff Career Paths', 'Staff Emails', 'School Culture'],
  'ops-review': ['Staff Profiles', 'Parent Messages', 'Staff Emails', 'School Culture']
};

export async function getIndexContext(prompt: string, tool: WhaleTool): Promise<AiIndexItem[]> {
  const categories = categoryMap[tool];
  const words = prompt.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 16);

  const { data, error } = await supabaseAdmin
    .from('ai_index_items')
    .select('*')
    .eq('approved', true)
    .in('category', categories)
    .limit(30);

  if (error) throw new Error(error.message);

  const staticMatches = appBaseIndexItems.filter((item) => categories.includes(item.category));
  const combined = [...(data ?? []), ...staticMatches] as AiIndexItem[];

  return combined
    .map((item: AiIndexItem) => {
      const haystack = `${item.title} ${item.category} ${item.content} ${(item.tags ?? []).join(' ')}`.toLowerCase();
      const score = words.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, 8)
    .map(({ item }) => item);
}

export async function generateWhaleContent(tool: WhaleTool, prompt: string, metadata: Record<string, unknown>) {
  if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY.');

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const indexItems = await getIndexContext(prompt, tool);
  const brain = await getSchoolBrainContext({ query: prompt, classroom: typeof metadata.classroom === 'string' ? metadata.classroom : undefined, limit: 10 });
  const context = indexItems
    .map((x) => `TITLE: ${x.title}
CATEGORY: ${x.category}
AGE: ${x.age_group ?? 'Any'}
CONTENT: ${x.content}`)
    .join('\n---\n');

  const system = `You are The Whale, a safe AI companion for preschool staff at Westhampton Day School. You work alongside Brightwheel and must never claim direct integration. Use the school index and staff profile context first, then create new material. Keep everything preschool-safe, privacy-conscious, warm, clear, age-appropriate, and staff-friendly. Never include private child data. Respect staff names, pronouns, role titles, classrooms, do-not-say notes, and career path instructions when provided. Avoid medical, legal, diagnostic, or disciplinary claims. Label sections clearly. For coloring pages, generate printable image prompts only unless an image provider is explicitly connected.`;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: `Tool: ${tool}
Metadata: ${JSON.stringify(metadata)}
Relevant school index:
${context || 'No relevant index items found.'}

School Brain context:
${formatSchoolBrainContext(brain)}
Request:
${prompt}`
      }
    ],
    temperature: 0.65
  });

  return { result: completion.choices[0]?.message?.content ?? '', sourcesUsed: indexItems };
}
