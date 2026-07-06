import { createServerSupabase } from '@/lib/supabaseServer';
import { fail, ok } from '@/lib/api';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return ok({ authenticated: false, user: null, profile: null });

    const { data: profile, error: profileError } = await supabase.from('profiles').select('id, email, full_name, role, created_at').eq('id', user.id).single();
    if (profileError) {
      return ok({ authenticated: true, user: { id: user.id, email: user.email }, profile: null });
    }

    return ok({ authenticated: true, user: { id: user.id, email: user.email }, profile });
  } catch (error) {
    return fail(error);
  }
}
