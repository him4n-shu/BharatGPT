import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  let client;
  try {
    const { email, newPassword, verificationToken } = await request.json();

    // Validation
    if (!email || !newPassword || !verificationToken) {
      return NextResponse.json(
        { error: 'Email, new password, and verification token are required' },
        { status: 400 }
      );
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Get MongoDB client
    client = await clientPromise;
    const db = client.db('bharatgpt');
    const otpCollection = db.collection('otps');
    const usersCollection = db.collection('users');

    const normalizedEmail = email.toLowerCase().trim();

    // Verify the verification token
    const otpRecord = await otpCollection.findOne({
      email: normalizedEmail,
      purpose: 'password_reset',
      verified: true,
      verificationToken: verificationToken,
      verifiedAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) } // Within last 15 minutes
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification. Please start the reset process again.' },
        { status: 401 }
      );
    }

    // Check if user exists
    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password
    const updateResult = await usersCollection.updateOne(
      { email: normalizedEmail },
      { 
        $set: { 
          password: hashedPassword,
          passwordResetAt: new Date(),
          lastPasswordChange: new Date()
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to update password');
    }

    // Delete the used OTP record
    await otpCollection.deleteOne({ _id: otpRecord._id });

    // Send password change confirmation email
    sendPasswordChangeConfirmation(normalizedEmail).catch(error => {
      console.error('Failed to send password change confirmation:', error);
      // Don't fail the password reset if confirmation email fails
    });

    return NextResponse.json({
      message: 'Password reset successfully',
      email: normalizedEmail,
    });

  } catch (error) {
    console.error('Reset Password error:', error);

    return NextResponse.json(
      { error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}

// Send password change confirmation email
async function sendPasswordChangeConfirmation(email) {
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
      subject: 'BharatGPT - Password Changed Successfully',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed - BharatGPT</title>
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
            .success-box {
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 25px 0;
            }
            .security-tips {
              background: #f0f9ff;
              border: 1px solid #0ea5e9;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #0c4a6e;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🇮🇳 BharatGPT</div>
              <h2>✅ Password Changed Successfully</h2>
            </div>
            
            <div class="success-box">
              <div style="font-size: 24px; margin-bottom: 10px;">🔐</div>
              <div style="font-size: 18px; font-weight: bold;">Password Updated</div>
              <div>Your BharatGPT account password has been changed successfully</div>
            </div>
            
            <p>Hello,</p>
            <p>This email confirms that your BharatGPT account password was successfully changed on ${new Date().toLocaleString()}.</p>
            
            <div class="security-tips">
              <strong>🛡️ Security Tips:</strong>
              <ul>
                <li>Keep your password confidential and don't share it with anyone</li>
                <li>Use a unique password that you don't use on other websites</li>
                <li>Consider using a password manager for better security</li>
                <li>If you notice any suspicious activity, contact us immediately</li>
              </ul>
            </div>
            
            <p>If you didn't make this change, please contact our support team immediately at <a href="mailto:support@bharatgpt.com">support@bharatgpt.com</a></p>
            
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
        BharatGPT - Password Changed Successfully
        
        Your BharatGPT account password has been changed successfully on ${new Date().toLocaleString()}.
        
        If you didn't make this change, please contact our support team immediately.
        
        Best regards,
        BharatGPT Security Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password change confirmation sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password change confirmation:', error);
    return { success: false, error: error.message };
  }
}
