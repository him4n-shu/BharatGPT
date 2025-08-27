import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request) {
  let client;
  try {
    const { email, purpose } = await request.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Default purpose to 'verification' if not provided
    const otpPurpose = purpose || 'verification';

    // Get MongoDB client
    client = await clientPromise;
    const db = client.db('bharatgpt');
    const otpCollection = db.collection('otps');
    const usersCollection = db.collection('users');

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting: Check if OTP was sent recently (within last 1 minute)
    const recentOtp = await otpCollection.findOne({
      email: normalizedEmail,
      createdAt: { $gt: new Date(Date.now() - 60000) }, // 1 minute ago
    });

    if (recentOtp) {
      return NextResponse.json(
        { error: 'Please wait before requesting another OTP. Try again in 1 minute.' },
        { status: 429 }
      );
    }

    // For login OTP, check if user exists
    if (otpPurpose === 'login') {
      const existingUser = await usersCollection.findOne({ email: normalizedEmail });
      if (!existingUser) {
        return NextResponse.json(
          { error: 'No account found with this email address' },
          { status: 404 }
        );
      }
    }

    // For registration OTP, check if user already exists
    if (otpPurpose === 'registration') {
      const existingUser = await usersCollection.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Delete any existing OTPs for this email
    await otpCollection.deleteMany({ email: normalizedEmail });

    // Save OTP to database
    const otpDoc = {
      email: normalizedEmail,
      otp: otp,
      purpose: otpPurpose,
      expiresAt: expiresAt,
      createdAt: new Date(),
      attempts: 0,
      verified: false,
    };

    await otpCollection.insertOne(otpDoc);

    // Send OTP email
    const emailResult = await sendOTPEmail(normalizedEmail, otp, otpPurpose);

    if (!emailResult.success) {
      // If email sending fails, delete the OTP from database
      await otpCollection.deleteOne({ email: normalizedEmail, otp: otp });
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'OTP sent successfully to your email',
      email: normalizedEmail,
      expiresIn: 300, // 5 minutes in seconds
    });

  } catch (error) {
    console.error('Send OTP error:', error);

    // Handle specific error types
    if (error.message.includes('Invalid email')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
