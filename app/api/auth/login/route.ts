import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabaseServer';
import { fail, ok, parseJson, normalizeEmail } from '@/lib/api';

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req: Request) {
  try {
    const body = await parseJson(req, Body);
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(body.email)!,
      password: body.password,
    });

    if (error) {
      return fail(error);
    }

    return ok({ message: 'Signed in successfully.' });
  } catch (error) {
    return fail(error);
  }
}
