// app/api/login/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('bharatgpt');
    const usersCollection = db.collection('users');

    // Normalize and check email
    const normalizedEmail = email.toLowerCase().trim();
    const user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Prepare user data without sensitive fields
    const { password: _, _id, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = generateToken(userWithoutPassword);

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
        token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error.message);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
