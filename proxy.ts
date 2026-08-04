import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.has('voter_uuid')) {
    response.cookies.set('voter_uuid', randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};