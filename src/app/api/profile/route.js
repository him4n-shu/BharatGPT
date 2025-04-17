import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';

async function handler(request) {
  // Access authenticated user data from request
  const user = request.user;

  return NextResponse.json({
    message: 'Profile data retrieved successfully',
    user: {
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber
    }
  });
}

// Protect the route with JWT authentication
export const GET = withAuth(handler);