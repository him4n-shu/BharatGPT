import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to other services like outlook, yahoo, etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your app password (not regular password)
    },
    // Alternative SMTP configuration (uncomment if using custom SMTP):
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: false, // true for 465, false for other ports
  });
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'BharatGPT',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: `BharatGPT - Your OTP for ${purpose}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BharatGPT OTP Verification</title>
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
              background: linear-gradient(135deg, #ff6b35, #f7931e);
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
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: linear-gradient(45deg, #ff6b35, #f7931e);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🇮🇳 BharatGPT</div>
              <h2>OTP Verification Required</h2>
            </div>
            
            <p>Hello,</p>
            <p>You have requested to ${purpose === 'login' ? 'login to' : 'register with'} your BharatGPT account. Please use the following OTP to complete the process:</p>
            
            <div class="otp-box">
              <div>Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div>Valid for 5 minutes</div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This OTP is valid for 5 minutes only</li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>For security, this code will expire automatically</li>
              </ul>
            </div>
            
            <p>If you're having trouble, please contact our support team or visit our help center.</p>
            
            <div class="footer">
              <p>Best regards,<br><strong>BharatGPT Team</strong></p>
              <p style="margin-top: 20px; font-size: 12px;">
                This is an automated email. Please do not reply to this message.<br>
                © 2024 BharatGPT. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Fallback text version
      text: `
        BharatGPT - OTP Verification
        
        Your verification code is: ${otp}
        
        This code is valid for 5 minutes only.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        BharatGPT Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after successful registration
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'BharatGPT',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: 'Welcome to BharatGPT! 🇮🇳',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to BharatGPT</title>
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
              font-size: 32px;
              font-weight: bold;
              background: linear-gradient(45deg, #ff6b35, #f7931e, #228b22);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 15px;
            }
            .welcome-banner {
              background: linear-gradient(135deg, #ff6b35, #f7931e);
              color: white;
              padding: 25px;
              border-radius: 8px;
              text-align: center;
              margin: 25px 0;
            }
            .features {
              background: #f8f9fa;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .feature-item {
              margin: 10px 0;
              padding: 10px 0;
              border-bottom: 1px solid #e9ecef;
            }
            .feature-item:last-child {
              border-bottom: none;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(45deg, #ff6b35, #f7931e);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
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
            </div>
            
            <div class="welcome-banner">
              <h1>Welcome to BharatGPT, ${name}! 🎉</h1>
              <p>Your account has been successfully created and verified!</p>
            </div>
            
            <p>We're excited to have you join our community of citizens accessing government services and information through AI.</p>
            
            <div class="features">
              <h3>🚀 What you can do with BharatGPT:</h3>
              <div class="feature-item">
                <strong>🤖 AI Assistant:</strong> Get instant answers about government schemes and services
              </div>
              <div class="feature-item">
                <strong>📋 Form Assistance:</strong> Get help filling government forms
              </div>
              <div class="feature-item">
                <strong>👥 Elder Care:</strong> Access senior citizen services and support
              </div>
              <div class="feature-item">
                <strong>🌾 Kisan Support:</strong> Farmer-specific schemes and assistance
              </div>
              <div class="feature-item">
                <strong>💰 Financial Aid:</strong> Information about subsidies and financial schemes
              </div>
              <div class="feature-item">
                <strong>🛡️ Safety Support:</strong> Emergency services and safety information
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" class="button">
                Start Exploring BharatGPT
              </a>
            </div>
            
            <div class="footer">
              <p>If you have any questions or need help, feel free to contact our support team.</p>
              <p style="margin-top: 20px;">
                <strong>BharatGPT Team</strong><br>
                Empowering Citizens with AI
              </p>
              <p style="margin-top: 20px; font-size: 12px;">
                © 2024 BharatGPT. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};
