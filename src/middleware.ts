import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════════
// SITE GATE MIDDLEWARE — password-protect the entire site during development
// Checks for a "tartary-gate" cookie; redirects to /gate if missing.
// To disable the gate, remove SITE_PASSWORD from environment variables.
// ═══════════════════════════════════════════════════════════════════════════

const PUBLIC_PATHS = ['/gate', '/api/gate'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip gate if no SITE_PASSWORD is set (gate disabled)
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) {
    return NextResponse.next();
  }

  // Allow public paths (gate page, gate API, static assets)
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|woff2?|ttf|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check for valid gate cookie
  const gateCookie = request.cookies.get('tartary-gate');
  if (gateCookie?.value === 'authorized') {
    return NextResponse.next();
  }

  // Redirect to gate
  const gateUrl = new URL('/gate', request.url);
  gateUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
