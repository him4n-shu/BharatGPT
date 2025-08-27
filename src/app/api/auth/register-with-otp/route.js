import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request) {
  let client;
  try {
    const { email, otp, name, password, mobileNumber } = await request.json();

    // Validation
    if (!email || !otp || !name || !password || !mobileNumber) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!mobileNumber.match(/^[0-9]{10}$/)) {
      return NextResponse.json(
        { error: 'Valid 10-digit mobile number is required' },
        { status: 400 }
      );
    }

    if (!otp.match(/^\d{6}$/)) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Get MongoDB client
    client = await clientPromise;
    const db = client.db('bharatgpt');
    const usersCollection = db.collection('users');
    const otpCollection = db.collection('otps');

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP first
    const otpRecord = await otpCollection.findOne({
      email: normalizedEmail,
      purpose: 'registration',
      verified: true,
      verifiedAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // Within last 5 minutes
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please verify OTP again.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      mobileNumber: mobileNumber.trim(),
      createdAt: new Date(),
      isEmailVerified: true, // Since OTP was verified
      lastLogin: null,
    };

    const result = await usersCollection.insertOne(newUser);

    if (!result.insertedId) {
      throw new Error('Failed to create user');
    }

    // Clean up verified OTP
    await otpCollection.deleteOne({ _id: otpRecord._id });

    // Prepare user data without sensitive fields
    const { password: _, _id, ...userWithoutPassword } = newUser;

    // Generate JWT token
    const token = generateToken(userWithoutPassword);

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(normalizedEmail, name.trim()).catch(error => {
      console.error('Failed to send welcome email:', error);
      // Don't fail registration if welcome email fails
    });

    // Set cookie with token
    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: userWithoutPassword,
        token
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific error types
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    if (error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
