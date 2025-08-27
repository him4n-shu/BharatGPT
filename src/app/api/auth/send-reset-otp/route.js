import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request) {
  let client;
  try {
    const { email } = await request.json();

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

    // Get MongoDB client
    client = await clientPromise;
    const db = client.db('bharatgpt');
    const otpCollection = db.collection('otps');
    const usersCollection = db.collection('users');

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (!existingUser) {
      // For security, don't reveal if email exists or not
      return NextResponse.json(
        { message: 'If this email exists in our system, you will receive a password reset code.' },
        { status: 200 }
      );
    }

    // Rate limiting: Check if OTP was sent recently (within last 1 minute)
    const recentOtp = await otpCollection.findOne({
      email: normalizedEmail,
      purpose: 'password_reset',
      createdAt: { $gt: new Date(Date.now() - 60000) }, // 1 minute ago
    });

    if (recentOtp) {
      return NextResponse.json(
        { error: 'Please wait before requesting another reset code. Try again in 1 minute.' },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes for password reset (longer than regular OTP)

    // Delete any existing password reset OTPs for this email
    await otpCollection.deleteMany({ 
      email: normalizedEmail, 
      purpose: 'password_reset' 
    });

    // Save OTP to database
    const otpDoc = {
      email: normalizedEmail,
      otp: otp,
      purpose: 'password_reset',
      expiresAt: expiresAt,
      createdAt: new Date(),
      attempts: 0,
      verified: false,
    };

    await otpCollection.insertOne(otpDoc);

    // Send password reset email with custom template
    const emailResult = await sendPasswordResetEmail(normalizedEmail, otp);

    if (!emailResult.success) {
      // If email sending fails, delete the OTP from database
      await otpCollection.deleteOne({ email: normalizedEmail, otp: otp });
      return NextResponse.json(
        { error: 'Failed to send reset code. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Password reset code sent to your email',
      email: normalizedEmail,
      expiresIn: 600, // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Send Reset OTP error:', error);

    return NextResponse.json(
      { error: 'Failed to send reset code. Please try again.' },
      { status: 500 }
    );
  }
}

// Custom email template for password reset
async function sendPasswordResetEmail(email, otp) {
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: {
        name: 'BharatGPT',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: 'BharatGPT - Password Reset Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BharatGPT Password Reset</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(45deg, #ff6b35, #f7931e, #228b22);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .otp-box {
              background: linear-gradient(135deg, #dc2626, #ef4444);
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 25px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 10px 0;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fef3c7;
              border: 1px solid #fbbf24;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #92400e;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
            .security-notice {
              background: #fef2f2;
              border: 1px solid #fca5a5;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #991b1b;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🇮🇳 BharatGPT</div>
              <h2>🔐 Password Reset Request</h2>
            </div>
            
            <p>Hello,</p>
            <p>We received a request to reset the password for your BharatGPT account. Use the code below to proceed:</p>
            
            <div class="otp-box">
              <div>Password Reset Code</div>
              <div class="otp-code">${otp}</div>
              <div>Valid for 10 minutes</div>
            </div>
            
            <div class="security-notice">
              <strong>🚨 Security Notice:</strong>
              <ul>
                <li>This code expires in 10 minutes</li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Consider changing your password if you suspect unauthorized access</li>
              </ul>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <p>If you didn't request a password reset, your account might be at risk. Please contact our support team immediately and consider enabling additional security measures.</p>
            </div>
            
            <p>If you're having trouble, please contact our support team or visit our help center.</p>
            
            <div class="footer">
              <p>Best regards,<br><strong>BharatGPT Security Team</strong></p>
              <p style="margin-top: 20px; font-size: 12px;">
                This is an automated security email. Please do not reply to this message.<br>
                © 2024 BharatGPT. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        BharatGPT - Password Reset Code
        
        Your password reset code is: ${otp}
        
        This code is valid for 10 minutes only.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        BharatGPT Security Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
}
