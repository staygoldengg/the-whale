import { z } from 'zod';
import { generateWhaleContent } from '@/lib/ai';
import { optionalAuth, canGenerate } from '@/lib/auth';
import { fail, ok, parseJson, HttpError, sanitizeText } from '@/lib/api';
import { writeAuditLog } from '@/lib/audit';
import { saveGeneration } from '@/lib/repositories';
import { runValidationPipeline } from '@/lib/validationPipeline';
import { getStaffProfiles } from '@/lib/repositories';

const Body = z.object({
  tool: z.enum(['theme-week','coloring-page','weekly-plan','parent-message','team-email','theme-analysis','career-path','ops-review']),
  prompt: z.string().min(3).max(5000).transform(sanitizeText),
  metadata: z.record(z.string(), z.unknown()).default({}),
  save: z.boolean().default(true),
  runPreflight: z.boolean().default(true)
});

export async function POST(req: Request) {
  try {
    const auth = await optionalAuth();
    if (auth && !canGenerate(auth.profile.role)) throw new HttpError(403, 'Your account does not have generator access.', 'FORBIDDEN');

    const body = await parseJson(req, Body);
    const data = await generateWhaleContent(body.tool, body.prompt, body.metadata);

    const classroom = typeof body.metadata.classroom === 'string' ? body.metadata.classroom : typeof body.metadata.className === 'string' ? body.metadata.className : undefined;
    const staffProfiles = body.runPreflight ? await getStaffProfiles({ classroom, activeOnly: true }) : [];
    const preflight = body.runPreflight ? runValidationPipeline(data.result, staffProfiles, {
      date: body.tool === 'parent-message' || body.tool === 'weekly-plan',
      classroom
    }) : null;

    const generationId = body.save && auth ? await saveGeneration({
      userId: auth.user.id,
      tool: body.tool,
      metadata: body.metadata,
      result: preflight?.finalContent ?? data.result,
      raw: data
    }) : null;

    if (auth) {
      await writeAuditLog({
        actorId: auth.user.id,
        action: 'ai.generate',
        entityType: 'ai_generation',
        entityId: generationId,
        metadata: { tool: body.tool, classroom, preflightStatus: preflight?.status ?? null }
      });
    }

    return ok({ ...data, result: preflight?.finalContent ?? data.result, preflight, generationId, guest: !auth });
  } catch (error) {
    return fail(error);
  }
}
