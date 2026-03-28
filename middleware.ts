import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const SAFE_REDIRECT_RE = /^\/admin(\/[a-zA-Z0-9\-_/]*)?$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname === '/admin/login' || pathname === '/admin/unauthorized') {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const accessToken = req.cookies.get('sb-access-token')?.value;
  const adminCookie = req.cookies.get('sb-admin')?.value;

  if (!accessToken && !adminCookie) {
    const loginUrl = new URL('/admin/login', req.url);
    if (SAFE_REDIRECT_RE.test(pathname)) {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (adminCookie === '1' && accessToken) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data: { user }, error } = await supabase.auth.getUser(accessToken);

      if (!error && user) {
        const role = user.app_metadata?.role;
        if (role !== 'admin') {
          return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
        }
        return NextResponse.next({ request: { headers: requestHeaders } });
      }
    } catch {
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!accessToken) {
    const loginUrl = new URL('/admin/login', req.url);
    if (SAFE_REDIRECT_RE.test(pathname)) {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      const loginUrl = new URL('/admin/login', req.url);
      if (SAFE_REDIRECT_RE.test(pathname)) {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    const role = user.app_metadata?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    const loginUrl = new URL('/admin/login', req.url);
    if (SAFE_REDIRECT_RE.test(pathname)) {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
