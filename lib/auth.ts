import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createRouteSupabase } from './supabaseServer';
import { supabaseAdmin } from './supabaseAdmin';
import { HttpError } from './api';
import type { Role } from './types';

export type AuthContext = {
  supabase: SupabaseClient;
  user: User;
  profile: { id: string; email: string; full_name: string | null; role: Role };
};

export async function requireAuth(allowedRoles?: Role[]): Promise<AuthContext> {
  const supabase = await createRouteSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new HttpError(401, 'Login required.', 'AUTH_REQUIRED');

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id,email,full_name,role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) throw new HttpError(403, 'Profile not found. Ask an admin to activate your account.', 'PROFILE_MISSING');
  if (allowedRoles?.length && !allowedRoles.includes(profile.role)) {
    throw new HttpError(403, 'You do not have permission for this action.', 'FORBIDDEN', { allowedRoles });
  }

  return { supabase, user, profile } as AuthContext;
}

export async function optionalAuth(allowedRoles?: Role[]): Promise<AuthContext | null> {
  const supabase = await createRouteSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id,email,full_name,role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return null;
  if (allowedRoles?.length && !allowedRoles.includes(profile.role)) {
    throw new HttpError(403, 'You do not have permission for this action.', 'FORBIDDEN', { allowedRoles });
  }

  return { supabase, user, profile } as AuthContext;
}

export function canGenerate(role: Role) {
  return ['admin', 'teacher', 'staff'].includes(role);
}

export function canManageSchoolBrain(role: Role) {
  return role === 'admin';
}
