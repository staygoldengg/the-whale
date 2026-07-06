import { supabaseAdmin } from './supabaseAdmin';
import { HttpError } from './api';
import type { StaffProfile } from './types';

export async function getStaffProfiles(input: { staffIds?: string[]; classroom?: string; activeOnly?: boolean } = {}) {
  let query = supabaseAdmin.from('staff_profiles').select('*');
  if (input.activeOnly ?? true) query = query.eq('active', true);
  if (input.staffIds?.length) query = query.in('id', input.staffIds);
  else if (input.classroom) query = query.eq('classroom', input.classroom);
  const { data, error } = await query.order('full_name', { ascending: true }).limit(200);
  if (error) throw new HttpError(500, error.message, 'STAFF_QUERY_FAILED');
  return (data ?? []) as StaffProfile[];
}

export async function saveContentReview(row: {
  userId: string;
  contentType: string;
  originalContent: string;
  brightwheelReadyContent: string;
  issues: unknown[];
  status: string;
}) {
  const { data, error } = await supabaseAdmin.from('content_reviews').insert({
    user_id: row.userId,
    content_type: row.contentType,
    original_content: row.originalContent,
    brightwheel_ready_content: row.brightwheelReadyContent,
    issues: row.issues,
    status: row.status
  }).select('id').single();
  if (error) throw new HttpError(500, error.message, 'REVIEW_SAVE_FAILED');
  return data.id as string;
}

export async function saveGeneration(input: {
  userId: string;
  tool: string;
  metadata: Record<string, unknown>;
  result: string;
  raw: unknown;
}) {
  const tableByTool: Record<string, string | null> = {
    'theme-week': 'theme_generations',
    'coloring-page': 'coloring_prompts',
    'weekly-plan': 'theme_generations',
    'parent-message': 'parent_messages',
    'team-email': null,
    'theme-analysis': null,
    'career-path': null,
    'ops-review': null
  };
  const table = tableByTool[input.tool];
  if (!table) return null;

  if (table === 'theme_generations') {
    const { data, error } = await supabaseAdmin.from(table).insert({
      user_id: input.userId,
      theme_name: String(input.metadata.theme ?? input.metadata.theme_name ?? input.tool),
      age_group: String(input.metadata.ageGroup ?? input.metadata.age_group ?? ''),
      input: input.metadata,
      output: input.raw
    }).select('id').single();
    if (error) throw new HttpError(500, error.message, 'GENERATION_SAVE_FAILED');
    return data.id as string;
  }

  if (table === 'coloring_prompts') {
    const { data, error } = await supabaseAdmin.from(table).insert({
      user_id: input.userId,
      theme: String(input.metadata.theme ?? ''),
      prompt: input.result,
      worksheet_title: String(input.metadata.worksheetTitle ?? input.metadata.theme ?? 'Coloring Page'),
      skill_focus: String(input.metadata.skillFocus ?? '')
    }).select('id').single();
    if (error) throw new HttpError(500, error.message, 'GENERATION_SAVE_FAILED');
    return data.id as string;
  }

  if (table === 'parent_messages') {
    const { data, error } = await supabaseAdmin.from(table).insert({
      user_id: input.userId,
      class_name: String(input.metadata.className ?? input.metadata.classroom ?? ''),
      message_type: String(input.metadata.messageType ?? ''),
      content: input.result
    }).select('id').single();
    if (error) throw new HttpError(500, error.message, 'GENERATION_SAVE_FAILED');
    return data.id as string;
  }

  return null;
}
