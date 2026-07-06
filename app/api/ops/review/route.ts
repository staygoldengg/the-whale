import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { fail, ok, parseJson, sanitizeText } from '@/lib/api';
import { getStaffProfiles, saveContentReview } from '@/lib/repositories';
import { runValidationPipeline } from '@/lib/validationPipeline';
import { formatForBrightwheel } from '@/lib/brightwheel';
import { writeAuditLog } from '@/lib/audit';

const Body = z.object({
  content: z.string().min(1).max(10000).transform(sanitizeText),
  classroom: z.string().optional(),
  staffIds: z.array(z.string().uuid()).optional(),
  save: z.boolean().default(true),
  contentType: z.string().min(1).max(80).default('general'),
  brightwheelTemplateType: z.string().optional(),
  requireDate: z.boolean().default(false)
});

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth();
    const body = await parseJson(req, Body);
    const staffProfiles = await getStaffProfiles({ staffIds: body.staffIds, classroom: body.classroom, activeOnly: true });
    const validation = runValidationPipeline(body.content, staffProfiles, { date: body.requireDate, classroom: body.classroom });
    const brightwheel = formatForBrightwheel({
      content: validation.finalContent,
      classroom: body.classroom,
      requireDate: body.requireDate,
      templateType: body.brightwheelTemplateType,
      validationIssues: validation.issues
    });
    const status = brightwheel.issues.some((i) => i.level === 'blocker') ? 'blocked' : brightwheel.issues.some((i) => i.level === 'warning') || brightwheel.checklist.some((c) => !c.passed) ? 'needs_review' : 'approved';

    const savedId = body.save ? await saveContentReview({
      userId: user.id,
      contentType: body.contentType,
      originalContent: body.content,
      brightwheelReadyContent: brightwheel.formatted,
      issues: brightwheel.issues,
      status
    }) : null;

    await writeAuditLog({ actorId: user.id, action: 'ops.review', entityType: 'content_review', entityId: savedId, metadata: { status, issueCount: brightwheel.issues.length } });
    return ok({ brightwheelReady: brightwheel.formatted, issues: brightwheel.issues, status, savedId, staffProfilesUsed: staffProfiles.length, checklist: brightwheel.checklist, copyInstructions: brightwheel.copyInstructions });
  } catch (error) {
    return fail(error);
  }
}
