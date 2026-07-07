import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabase() {
  // Use placeholder values during build if not available
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  try {
    return createBrowserClient(url, key);
  } catch (error) {
    // Return null if client creation fails (useful during build/SSR)
    console.warn('Supabase client creation failed:', error);
    return null as any;
  }
}
