import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from "@/i18n/routing";

// Initialize next-intl middleware for locale detection & routing
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  // First, let next‑intl handle locale detection and redirects.
  const intlResponse = intlMiddleware(request);
  if (intlResponse) {
    return intlResponse;
  }

  // Next, enforce auth for admin routes.
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin') {
    const isAuthenticated =
      request.cookies.get('admin-session')?.value === 'authenticated';

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Fall through for all other requests.
  return NextResponse.next();
}

export const config = {
  // Combine next‑intl matcher with admin routes
  matcher: ['/((?!api|_next|.*\\..*).*)', '/admin/:path*']
};