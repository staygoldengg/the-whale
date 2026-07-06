import { createServerSupabase } from '@/lib/supabaseServer';
import type { Role } from '@/lib/types';

export async function getCurrentProfile() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return data;
}

export function canManage(role?: Role | null) {
  return role === 'admin';
}

export function canGenerate(role?: Role | null) {
  return role === 'admin' || role === 'teacher' || role === 'staff';
}
