import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/jwt';

export function withAuth(handler) {
  return async function (request, ...args) {
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add user data to request for use in protected routes
    request.user = decoded;
    return handler(request, ...args);
  };
}