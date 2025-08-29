// app/api/login/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';

export async function POST(request) {
  let client;
  try {
    const { email, password, loginMethod } = await request.json();

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // For password login, password is required
    if (loginMethod !== 'otp' && !password) {
      return NextResponse.json(
        { error: 'Password is required for password login' },
        { status: 400 }
      );
    }

    // Get MongoDB client with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    client = await Promise.race([clientPromise, timeoutPromise]);
    const db = client.db('bharatgpt');
    const usersCollection = db.collection('users');

    // Normalize and check email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Use projection to only fetch needed fields
    const user = await usersCollection.findOne(
      { email: normalizedEmail },
      { projection: { email: 1, password: 1, name: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: loginMethod === 'otp' ? 'No account found with this email' : 'Invalid email or password' },
        { status: 401 }
      );
    }

    // For password login, verify password
    if (loginMethod !== 'otp') {
      // Check password with timeout
      const passwordPromise = bcrypt.compare(password, user.password);
      const isPasswordValid = await Promise.race([
        passwordPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Password verification timeout')), 3000))
      ]);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // For OTP login, verify that OTP was already verified
    // (This route is called after OTP verification is successful)
    if (loginMethod === 'otp') {
      const otpCollection = db.collection('otps');
      const verifiedOtp = await otpCollection.findOne({
        email: normalizedEmail,
        purpose: 'login',
        verified: true,
        verifiedAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // Within last 5 minutes
      });

      if (!verifiedOtp) {
        return NextResponse.json(
          { error: 'OTP verification required' },
          { status: 401 }
        );
      }
    }

    // Prepare user data without sensitive fields
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token with userId
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    };
    const token = generateToken(tokenPayload);

    // Set cookie with token
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
        token
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error.message);

    if (error.message === 'Database connection timeout') {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    if (error.message === 'Password verification timeout') {
      return NextResponse.json(
        { error: 'Request timeout. Please try again.' },
        { status: 504 }
      );
    }

    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
