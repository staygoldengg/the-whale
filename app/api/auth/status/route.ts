import { createServerSupabase } from '@/lib/supabaseServer';
import { fail, ok } from '@/lib/api';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return ok({ authenticated: false, user: null });

    const { data: profile, error: profileError } = await supabase.auth.getUser();
    if (profileError) return ok({ authenticated: true, user: { id: user.id, email: user.email }, profile: null });

    return ok({ authenticated: true, user: { id: user.id, email: user.email }, profile: null });
  } catch (error) {
    return fail(error);
  }
}
