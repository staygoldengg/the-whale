import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return req.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      }
    }
  });

  const { data: { session } } = await supabase.auth.getSession();
  const guestCookie = req.cookies.get('guest')?.value;

  if (req.nextUrl.pathname.startsWith('/dashboard') && !session && guestCookie !== 'true') {
    res.cookies.set('guest', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' });
  }

  return res;
}

export const config = { matcher: ['/dashboard/:path*'] };
