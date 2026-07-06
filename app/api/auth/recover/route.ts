import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabaseServer';
import { fail, ok, parseJson, normalizeEmail } from '@/lib/api';

const Body = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await parseJson(req, Body);
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: `${new URL(req.url).origin}/login`,
    });

    if (error) return fail(error);
    return ok({ message: 'Password recovery email sent if that account exists.' });
  } catch (error) {
    return fail(error);
  }
}
