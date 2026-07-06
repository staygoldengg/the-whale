import { z } from 'zod';
import { fail, ok, parseJson, sanitizeText } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSchoolBrainContext, formatSchoolBrainContext } from '@/lib/schoolBrain';
import { generateWhaleContent } from '@/lib/ai';
import { runValidationPipeline } from '@/lib/validationPipeline';
import { scoreContentQuality, qualityLabel } from '@/lib/qualityScore';
import { writeAuditLog } from '@/lib/audit';
import { recordAnalyticsEvent } from '@/lib/schoolOS';

const schema = z.object({
  classroom: z.string().min(1),
  ageGroup: z.string().min(1),
  theme: z.string().min(1),
  weekOf: z.string().min(1),
  developmentalGoals: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  notes: z.string().optional().default('')
});

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(['admin', 'teacher']);
    const body = await parseJson(req, schema);
    const ctx = await getSchoolBrainContext({ query: `${body.theme} ${body.classroom} lesson plan`, classroom: body.classroom, limit: 18 });
    const contextText = formatSchoolBrainContext(ctx);
    const prompt = `Create a preschool weekly lesson plan for ${body.classroom}. Age group: ${body.ageGroup}. Week of: ${body.weekOf}. Theme: ${body.theme}. Developmental goals: ${body.developmentalGoals.join(', ') || 'use age-appropriate goals'}. Materials: ${body.materials.join(', ') || 'common classroom materials'}. Notes: ${body.notes}\n\nUse the approved School Brain context below. Include Monday-Friday, circle time, art, music/movement, outdoor/gross motor, fine motor, SEL, supplies, teacher prep, and a short Brightwheel parent note.\n\n${contextText}`;
    const result = await generateWhaleContent('weekly-plan', prompt, body);
    const content = sanitizeText(result.result);
    const preflight = runValidationPipeline(content, ctx.staffProfiles, { classroom: body.classroom });
    const qualityScore = scoreContentQuality(preflight.issues, content);
    const { data, error } = await supabaseAdmin.from('lesson_plans').insert({
      user_id: auth.profile.id,
      classroom: body.classroom,
      age_group: body.ageGroup,
      theme: body.theme,
      week_of: body.weekOf,
      developmental_goals: body.developmentalGoals,
      materials: body.materials,
      plan: { content, sourcesUsed: result.sourcesUsed ?? [], qualityScore, qualityLabel: qualityLabel(qualityScore), issues: preflight.issues },
      status: preflight.issues.some((i) => i.level === 'blocker') ? 'needs_review' : 'draft'
    }).select('*').single();
    if (error) throw error;
    await writeAuditLog({ actorId: auth.profile.id, action: 'lesson_plan_created', entityType: 'lesson_plans', entityId: data.id, metadata: { classroom: body.classroom, theme: body.theme, qualityScore } });
    await recordAnalyticsEvent({ actorId: auth.profile.id, eventName: 'lesson_plan_created', entityType: 'lesson_plans', entityId: data.id, metadata: { classroom: body.classroom, theme: body.theme } });
    return ok({ lessonPlan: data, qualityScore, qualityLabel: qualityLabel(qualityScore), issues: preflight.issues });
  } catch (error) {
    return fail(error);
  }
}
