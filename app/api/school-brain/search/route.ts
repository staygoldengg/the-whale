import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { fail, ok, parseJson } from '@/lib/api';
import { getSchoolBrainContext, formatSchoolBrainContext } from '@/lib/schoolBrain';
import { writeAuditLog } from '@/lib/audit';

const Body = z.object({
  query: z.string().max(1000).optional(),
  classroom: z.string().max(120).optional(),
  staffEmail: z.string().email().optional(),
  categories: z.array(z.string().max(80)).optional(),
  limit: z.number().int().min(1).max(50).optional()
});

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth();
    const body = await parseJson(req, Body);
    const context = await getSchoolBrainContext(body);
    await writeAuditLog({ actorId: user.id, action: 'school_brain.search', entityType: 'school_brain', metadata: { query: body.query, classroom: body.classroom } });
    return ok({ context, formattedContext: formatSchoolBrainContext(context) });
  } catch (error) {
    return fail(error);
  }
}
