import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { fail, ok, parseJson, sanitizeText } from '@/lib/api';
import { getStaffProfiles, saveContentReview } from '@/lib/repositories';
import { runValidationPipeline } from '@/lib/validationPipeline';
import { writeAuditLog } from '@/lib/audit';

const Body = z.object({
  content: z.string().min(1).max(12000).transform(sanitizeText),
  classroom: z.string().optional(),
  staffIds: z.array(z.string().uuid()).optional(),
  requireDate: z.boolean().default(false),
  save: z.boolean().default(false),
  contentType: z.string().min(1).max(80).default('preflight')
});

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth();
    const body = await parseJson(req, Body);
    const staffProfiles = await getStaffProfiles({ staffIds: body.staffIds, classroom: body.classroom, activeOnly: true });
    const result = runValidationPipeline(body.content, staffProfiles, { date: body.requireDate, classroom: body.classroom });

    const savedId = body.save ? await saveContentReview({
      userId: user.id,
      contentType: body.contentType,
      originalContent: body.content,
      brightwheelReadyContent: result.finalContent,
      issues: result.issues,
      status: result.status
    }) : null;

    await writeAuditLog({ actorId: user.id, action: 'content.preflight', entityType: 'content_review', entityId: savedId, metadata: { status: result.status, issueCount: result.issues.length } });
    return ok({ ...result, savedId, staffProfilesUsed: staffProfiles.length });
  } catch (error) {
    return fail(error);
  }
}
