import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { fail, ok, parseJson, sanitizeText, HttpError } from '@/lib/api';
import { createWorkspaceDoc } from '@/lib/googleWorkspace';
import { writeAuditLog } from '@/lib/audit';

const Body = z.object({
  title: z.string().min(2).max(120).transform(sanitizeText),
  content: z.string().min(1).max(50000).transform(sanitizeText),
  folderId: z.string().optional(),
  reviewId: z.string().uuid().optional()
});

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth();
    const body = await parseJson(req, Body);
    const doc = await createWorkspaceDoc(body);

    const { data, error } = await supabaseAdmin.from('google_doc_exports').insert({
      user_id: user.id,
      review_id: body.reviewId ?? null,
      title: body.title,
      document_id: doc.documentId,
      url: doc.url,
      configured: true
    }).select('id').single();
    if (error) throw new HttpError(500, error.message, 'DOC_EXPORT_LOG_FAILED');

    if (body.reviewId) {
      await supabaseAdmin.from('content_reviews').update({ status: 'exported_to_google_docs' }).eq('id', body.reviewId);
    }

    await writeAuditLog({ actorId: user.id, action: 'google.docs.create', entityType: 'google_doc_export', entityId: data.id, metadata: { title: body.title, reviewId: body.reviewId ?? null } });
    return ok({ ...doc, exportId: data.id });
  } catch (error) {
    return fail(error);
  }
}
