import type { AiIndexItem, WhaleTool } from './types';
import { getSchoolBrainContext, formatSchoolBrainContext } from './schoolBrain';
import { appBaseIndexItems } from './appIndex';
import { customIndexDocuments } from './indexDocuments';
import { connectorIndexItems } from './externalConnectors';
import { campLessonRecordsToIndexItems, lessonPlanRecords } from './lessonPlanKnowledge';
import { supabaseAdmin } from './supabaseAdmin';

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

  let dbData: AiIndexItem[] = [];
  
  try {
    const { data, error } = await supabaseAdmin
      .from('ai_index_items')
      .select('*')
      .eq('approved', true)
      .in('category', categories)
      .limit(30);

    if (error) {
      console.warn('Failed to fetch from Supabase:', error.message);
    } else {
      dbData = data || [];
    }
  } catch (err) {
    console.warn('Supabase connection error:', err);
  }

  const staticMatches = appBaseIndexItems.filter((item) => categories.includes(item.category));
  const customMatches = customIndexDocuments.filter((item) => categories.includes(item.category));
  const integrationMatches = connectorIndexItems.filter((item) => categories.includes(item.category));
  const lessonMatches = campLessonRecordsToIndexItems(lessonPlanRecords).filter((item) =>
    categories.includes(item.category)
  );
  const combined = [
    ...dbData,
    ...staticMatches,
    ...customMatches,
    ...integrationMatches,
    ...lessonMatches
  ] as AiIndexItem[];

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

async function callGroqAPI(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  if (!apiKey) {
    // Fallback to local response using index data
    return {
      result: 'AI is initializing. Add your Groq API key to environment variables for full AI features.',
      sourcesUsed: []
    };
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages,
      temperature: 0.65,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? '';
}

export async function generateWhaleContent(tool: WhaleTool, prompt: string, metadata: Record<string, unknown>) {
  const indexItems = await getIndexContext(prompt, tool);
  const brain = await getSchoolBrainContext({
    query: prompt,
    classroom: typeof metadata.classroom === 'string' ? metadata.classroom : undefined,
    limit: 10
  });
  
  const context = indexItems
    .map((x) => `TITLE: ${x.title}
CATEGORY: ${x.category}
AGE: ${x.age_group ?? 'Any'}
CONTENT: ${x.content}`)
    .join('\n---\n');

  const system = `You are The Whale, a safe AI companion for preschool staff at Westhampton Day School. You work alongside Brightwheel and must never claim direct integration. Use the school index and staff profile context first, then create new material. Keep everything preschool-safe, privacy-conscious, warm, clear, age-appropriate, and staff-friendly. Never include private child data. Respect staff names, pronouns, role titles, classrooms, do-not-say notes, and career path instructions when provided. Avoid medical, legal, diagnostic, or disciplinary claims. Label sections clearly. For coloring pages, generate printable image prompts only unless an image provider is explicitly connected.`;

  try {
    const result = await callGroqAPI([
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
    ]);

    return { result, sourcesUsed: indexItems };
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error;
  }
}
