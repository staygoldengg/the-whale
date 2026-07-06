import { z } from 'zod';
import { fail, ok, parseJson, sanitizeText } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { writeAuditLog } from '@/lib/audit';

const schema = z.object({
  feedbackType: z.enum(['suggestion','concern','appreciation','training_request','supply_request','classroom_improvement']),
  classroom: z.string().optional().nullable(),
  title: z.string().min(3),
  body: z.string().min(5),
  anonymous: z.boolean().default(true)
});

export async function GET() {
  try {
    const auth = await requireAuth(['admin']);
    const { data, error } = await supabaseAdmin.from('staff_feedback').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    await writeAuditLog({ actorId: auth.profile.id, action: 'feedback_reviewed', entityType: 'staff_feedback' });
    return ok({ items: data ?? [] });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    const body = await parseJson(req, schema);
    const { data, error } = await supabaseAdmin.from('staff_feedback').insert({
      submitted_by: body.anonymous ? null : auth.profile.id,
      feedback_type: body.feedbackType,
      classroom: body.classroom ?? null,
      title: sanitizeText(body.title),
      body: sanitizeText(body.body),
      anonymous: body.anonymous,
      status: 'open'
    }).select('id,feedback_type,title,status,anonymous,created_at').single();
    if (error) throw error;
    return ok({ item: data }, 201);
  } catch (error) {
    return fail(error);
  }
}
