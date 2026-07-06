import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { fail, ok, parseJson, normalizeEmail, sanitizeText, HttpError } from '@/lib/api';
import { writeAuditLog } from '@/lib/audit';

const Body = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(2).max(160).transform(sanitizeText),
  preferred_name: z.string().max(80).optional().transform((v) => v ? sanitizeText(v) : v),
  email: z.string().email().optional().or(z.literal('')),
  role_title: z.string().max(120).optional(),
  classroom: z.string().max(120).optional(),
  pronouns: z.string().max(80).optional(),
  gender_reference: z.string().max(80).optional(),
  career_goal: z.string().max(500).optional(),
  strengths: z.union([z.string(), z.array(z.string())]).optional(),
  growth_areas: z.union([z.string(), z.array(z.string())]).optional(),
  certifications: z.union([z.string(), z.array(z.string())]).optional(),
  tone_preference: z.string().max(200).optional(),
  do_not_say: z.union([z.string(), z.array(z.string())]).optional(),
  notes: z.string().max(3000).optional(),
  active: z.boolean().optional()
});

function splitList(value?: string | string[]) {
  if (Array.isArray(value)) return value.map((x) => x.trim()).filter(Boolean);
  return (value ?? '').split(',').map((x) => x.trim()).filter(Boolean);
}

export async function GET() {
  try {
    await requireAuth();
    const { data, error } = await supabaseAdmin.from('staff_profiles').select('*').order('full_name', { ascending: true }).limit(300);
    if (error) throw new HttpError(500, error.message, 'STAFF_QUERY_FAILED');
    return ok({ staffProfiles: data ?? [] });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth(['admin']);
    const body = await parseJson(req, Body);
    const row = {
      full_name: body.full_name,
      preferred_name: body.preferred_name || null,
      email: normalizeEmail(body.email),
      role_title: body.role_title || null,
      classroom: body.classroom || null,
      pronouns: body.pronouns || null,
      gender_reference: body.gender_reference || null,
      career_goal: body.career_goal || null,
      strengths: splitList(body.strengths),
      growth_areas: splitList(body.growth_areas),
      certifications: splitList(body.certifications),
      tone_preference: body.tone_preference || null,
      do_not_say: splitList(body.do_not_say),
      notes: body.notes || null,
      active: body.active ?? true,
      created_by: user.id
    };

    const query = body.id
      ? supabaseAdmin.from('staff_profiles').update(row).eq('id', body.id).select('*').single()
      : supabaseAdmin.from('staff_profiles').insert(row).select('*').single();

    const { data, error } = await query;
    if (error) throw new HttpError(500, error.message, 'STAFF_SAVE_FAILED');
    await writeAuditLog({ actorId: user.id, action: body.id ? 'staff_profile.update' : 'staff_profile.create', entityType: 'staff_profile', entityId: data.id, metadata: { fullName: data.full_name, classroom: data.classroom } });
    return ok(data, body.id ? 200 : 201);
  } catch (error) {
    return fail(error);
  }
}
