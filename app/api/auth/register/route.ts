import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { fail, ok, parseJson, normalizeEmail, sanitizeText, HttpError } from '@/lib/api';

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().max(160).optional().transform((v) => v ? sanitizeText(v) : null)
});

export async function POST(req: Request) {
  try {
    const body = await parseJson(req, Body);
    const email = normalizeEmail(body.email)!;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        full_name: body.full_name,
      },
    });

    if (error) {
      throw new HttpError(400, error.message, 'SIGNUP_FAILED');
    }

    if (!data.user) {
      throw new HttpError(500, 'Failed to create user account.', 'SIGNUP_FAILED');
    }

    const profile = {
      id: data.user.id,
      email,
      full_name: body.full_name,
      role: 'staff',
      active: true
    };

    const { error: profileError } = await supabaseAdmin.from('profiles').insert(profile);
    if (profileError) {
      throw new HttpError(500, profileError.message, 'PROFILE_CREATE_FAILED');
    }

    return ok({ message: 'Account created successfully.' }, 201);
  } catch (error) {
    return fail(error);
  }
}
