import { z } from 'zod';
import { fail, ok, parseJson, sanitizeText } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { writeAuditLog } from '@/lib/audit';

const schema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  ageGroup: z.string().optional().nullable(),
  content: z.string().min(10),
  tags: z.array(z.string()).default([]),
  submitForReview: z.boolean().default(true)
});

export async function GET(req: Request) {
  try {
    await requireAuth();
    const url = new URL(req.url);
    const status = url.searchParams.get('status') ?? 'approved';
    let query = supabaseAdmin.from('resource_library_items').select('*').order('updated_at', { ascending: false }).limit(100);
    if (status !== 'all') query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return ok({ items: data ?? [] });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(['admin', 'teacher']);
    const body = await parseJson(req, schema);
    const status = auth.profile.role === 'admin' && !body.submitForReview ? 'approved' : 'pending_review';
    const { data, error } = await supabaseAdmin.from('resource_library_items').insert({
      title: sanitizeText(body.title),
      category: sanitizeText(body.category),
      age_group: body.ageGroup,
      content: sanitizeText(body.content),
      tags: body.tags,
      status,
      submitted_by: auth.profile.id,
      approved_by: status === 'approved' ? auth.profile.id : null,
      approved_at: status === 'approved' ? new Date().toISOString() : null
    }).select('*').single();
    if (error) throw error;
    await writeAuditLog({ actorId: auth.profile.id, action: 'resource_submitted', entityType: 'resource_library_items', entityId: data.id, metadata: { status } });
    return ok({ item: data }, 201);
  } catch (error) {
    return fail(error);
  }
}
