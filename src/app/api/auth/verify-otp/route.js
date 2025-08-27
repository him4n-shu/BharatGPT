import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  let client;
  try {
    const { email, otp, purpose } = await request.json();

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
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
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Get MongoDB client
    client = await clientPromise;
    const db = client.db('bharatgpt');
    const otpCollection = db.collection('otps');

    const normalizedEmail = email.toLowerCase().trim();
    const otpPurpose = purpose || 'verification';

    // Find the OTP record
    const otpRecord = await otpCollection.findOne({
      email: normalizedEmail,
      purpose: otpPurpose,
      verified: false,
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No valid OTP found for this email. Please request a new OTP.' },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      // Delete expired OTP
      await otpCollection.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new OTP.' },
        { status: 410 }
      );
    }

    // Check attempt limit (max 3 attempts)
    if (otpRecord.attempts >= 3) {
      // Delete OTP after too many failed attempts
      await otpCollection.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
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
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
          remainingAttempts: remainingAttempts
        },
        { status: 400 }
      );
    }

    // OTP is valid - mark as verified
    await otpCollection.updateOne(
      { _id: otpRecord._id },
      { 
        $set: { 
          verified: true,
          verifiedAt: new Date()
        }
      }
    );

    // Schedule deletion of OTP record after 1 hour (for audit purposes)
    setTimeout(async () => {
      try {
        await otpCollection.deleteOne({ _id: otpRecord._id });
      } catch (error) {
        console.error('Error deleting verified OTP:', error);
      }
    }, 60 * 60 * 1000); // 1 hour

    return NextResponse.json({
      message: 'OTP verified successfully',
      email: normalizedEmail,
      purpose: otpPurpose,
      verified: true,
      verificationToken: `${otpRecord._id}_${Date.now()}`, // Temporary token for next step
    });

  } catch (error) {
    console.error('Verify OTP error:', error);

    // Handle specific error types
    if (error.message.includes('Invalid OTP format')) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}
