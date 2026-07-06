import { z } from 'zod';
import { fail, ok, parseJson, sanitizeText } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const schema = z.object({
  title: z.string().min(3),
  body: z.string().min(3),
  audienceRole: z.enum(['admin','teacher','staff','all']).default('all'),
  priority: z.enum(['low','normal','high','urgent']).default('normal'),
  actionUrl: z.string().optional().nullable()
});

export async function GET() {
  try {
    const auth = await requireAuth();
    let query = supabaseAdmin.from('notifications').select('*').eq('resolved', false).order('created_at', { ascending: false }).limit(50);
    if (auth.profile.role !== 'admin') query = query.in('audience_role', [auth.profile.role, 'all']);
    const { data, error } = await query;
    if (error) throw error;
    return ok({ notifications: data ?? [] });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(['admin']);
    const body = await parseJson(req, schema);
    const { data, error } = await supabaseAdmin.from('notifications').insert({
      title: sanitizeText(body.title),
      body: sanitizeText(body.body),
      audience_role: body.audienceRole,
      priority: body.priority,
      action_url: body.actionUrl ?? null,
      created_by: auth.profile.id
    }).select('*').single();
    if (error) throw error;
    return ok({ notification: data }, 201);
  } catch (error) {
    return fail(error);
  }
}
