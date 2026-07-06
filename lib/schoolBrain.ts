import { supabaseAdmin } from './supabaseAdmin';
import type { AiIndexItem, StaffProfile } from './types';

export type SchoolBrainContext = {
  staffProfiles: StaffProfile[];
  indexItems: AiIndexItem[];
  classrooms: any[];
  procedures: any[];
  events: any[];
  templates: any[];
};

export async function getSchoolBrainContext(input: {
  query?: string;
  classroom?: string;
  staffEmail?: string;
  categories?: string[];
  limit?: number;
}): Promise<SchoolBrainContext> {
  const limit = input.limit ?? 12;
  const queryWords = (input.query ?? '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 20);

  let staffQuery = supabaseAdmin.from('staff_profiles').select('*').eq('active', true).limit(50);
  if (input.classroom) staffQuery = staffQuery.eq('classroom', input.classroom);
  if (input.staffEmail) staffQuery = staffQuery.eq('email', input.staffEmail);

  let indexQuery = supabaseAdmin.from('ai_index_items').select('*').eq('approved', true).limit(80);
  if (input.categories?.length) indexQuery = indexQuery.in('category', input.categories);

  const [staffRes, indexRes, classroomRes, procedureRes, eventRes, templateRes] = await Promise.all([
    staffQuery,
    indexQuery,
    supabaseAdmin.from('classrooms').select('*').eq('active', true).limit(50),
    supabaseAdmin.from('school_procedures').select('*').eq('approved', true).limit(50),
    supabaseAdmin.from('school_events').select('*').gte('event_date', new Date().toISOString().slice(0, 10)).order('event_date', { ascending: true }).limit(20),
    supabaseAdmin.from('brightwheel_templates').select('*').eq('active', true).limit(50)
  ]);

  if (staffRes.error) throw new Error(staffRes.error.message);
  if (indexRes.error) throw new Error(indexRes.error.message);

  const scoredIndex = (indexRes.data ?? [])
    .map((item: AiIndexItem) => {
      const haystack = `${item.title} ${item.category} ${item.content} ${(item.tags ?? []).join(' ')}`.toLowerCase();
      const score = queryWords.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map(({ item }) => item);

  return {
    staffProfiles: staffRes.data ?? [],
    indexItems: scoredIndex,
    classrooms: classroomRes.data ?? [],
    procedures: procedureRes.data ?? [],
    events: eventRes.data ?? [],
    templates: templateRes.data ?? []
  };
}

export function formatSchoolBrainContext(ctx: SchoolBrainContext) {
  return [
    'STAFF PROFILES:',
    ctx.staffProfiles.map((s) => `- ${s.full_name}${s.preferred_name ? ` (${s.preferred_name})` : ''}; role: ${s.role_title ?? 'unset'}; classroom: ${s.classroom ?? 'unset'}; pronouns: ${s.pronouns ?? s.gender_reference ?? 'unset'}; tone: ${s.tone_preference ?? 'unset'}; career goal: ${s.career_goal ?? 'unset'}; do not say: ${(s.do_not_say ?? []).join(', ') || 'none'}`).join('\n') || 'None',
    'CLASSROOMS:',
    ctx.classrooms.map((c) => `- ${c.name}; age group: ${c.age_group ?? 'unset'}; lead: ${c.lead_teacher ?? 'unset'}; notes: ${c.notes ?? ''}`).join('\n') || 'None',
    'UPCOMING EVENTS:',
    ctx.events.map((e) => `- ${e.event_date}: ${e.title}; ${e.description ?? ''}`).join('\n') || 'None',
    'PROCEDURES:',
    ctx.procedures.map((p) => `- ${p.title} (${p.category}): ${p.content}`).join('\n') || 'None',
    'BRIGHTWHEEL TEMPLATES:',
    ctx.templates.map((t) => `- ${t.name} (${t.message_type}): ${t.template}`).join('\n') || 'None',
    'APPROVED AI INDEX:',
    ctx.indexItems.map((i) => `- ${i.title} (${i.category}): ${i.content}`).join('\n') || 'None'
  ].join('\n');
}
