import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  let client;
  try {
    const { email, otp } = await request.json();

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!otp.match(/^\d{6}$/)) {
      return NextResponse.json(
        { error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    // Get MongoDB client
    client = await clientPromise;
    const db = client.db('bharatgpt');
    const otpCollection = db.collection('otps');

    const normalizedEmail = email.toLowerCase().trim();

    // Find the OTP record
    const otpRecord = await otpCollection.findOne({
      email: normalizedEmail,
      purpose: 'password_reset',
      verified: false,
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No valid reset code found for this email. Please request a new code.' },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      // Delete expired OTP
      await otpCollection.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Reset code has expired. Please request a new code.' },
        { status: 410 }
      );
    }

    // Check attempt limit (max 3 attempts)
    if (otpRecord.attempts >= 3) {
      // Delete OTP after too many failed attempts
      await otpCollection.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new reset code.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempt count
      await otpCollection.updateOne(
        { _id: otpRecord._id },
        { 
          $inc: { attempts: 1 },
          $set: { lastAttemptAt: new Date() }
        }
      );

      const remainingAttempts = 3 - (otpRecord.attempts + 1);
      return NextResponse.json(
        { 
          error: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
          remainingAttempts: remainingAttempts
        },
        { status: 400 }
      );
    }

    // OTP is valid - mark as verified and create verification token
    const verificationToken = `reset_${otpRecord._id}_${Date.now()}`;
    
    await otpCollection.updateOne(
      { _id: otpRecord._id },
      { 
        $set: { 
          verified: true,
          verifiedAt: new Date(),
          verificationToken: verificationToken
        }
      }
    );

    return NextResponse.json({
      message: 'Verification code confirmed',
      email: normalizedEmail,
      verified: true,
      verificationToken: verificationToken,
    });

  } catch (error) {
    console.error('Verify Reset OTP error:', error);

    return NextResponse.json(
      { error: 'Failed to verify code. Please try again.' },
      { status: 500 }
    );
  }
}
