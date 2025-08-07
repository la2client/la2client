import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin') {
    // Check for admin session (you can implement proper session management)
    const isAuthenticated = request.cookies.get('admin-session')?.value === 'authenticated';
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};