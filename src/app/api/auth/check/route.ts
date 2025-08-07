import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const isAuthenticated = request.cookies.get('admin-session')?.value === 'authenticated';
  
  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}