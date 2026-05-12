import { NextResponse } from 'next/server'

// Auth middleware — swap this for Supabase SSR auth when Supabase is configured.
// For demo mode, all routes are accessible without a session.
export async function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
