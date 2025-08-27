import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      session.userId = token.userId;
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account.provider === 'google') {
          // Connect to MongoDB
          const client = await clientPromise;
          const db = client.db('bharatgpt');
          const usersCollection = db.collection('users');

          // Check if user already exists
          const existingUser = await usersCollection.findOne({
            email: user.email.toLowerCase().trim()
          });

          if (existingUser) {
            // Update last login and Google info if needed
            await usersCollection.updateOne(
              { email: user.email.toLowerCase().trim() },
              {
                $set: {
                  lastLogin: new Date(),
                  googleId: profile.sub,
                  image: user.image,
                  updatedAt: new Date(),
                  // Add isEmailVerified since Google emails are pre-verified
                  isEmailVerified: true,
                }
              }
            );
          } else {
            // Create new user from Google profile
            const newUser = {
              name: user.name,
              email: user.email.toLowerCase().trim(),
              image: user.image,
              googleId: profile.sub,
              provider: 'google',
              isEmailVerified: true, // Google emails are pre-verified
              createdAt: new Date(),
              lastLogin: new Date(),
              role: 'user',
            };

            await usersCollection.insertOne(newUser);

            // Send welcome email for new Google users
            sendGoogleWelcomeEmail(user.email, user.name).catch(error => {
              console.error('Failed to send Google welcome email:', error);
              // Don't fail signin if welcome email fails
            });
          }
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', user.email, 'via', account.provider);
    },
  },
};

// Send welcome email for Google sign-ups
async function sendGoogleWelcomeEmail(email, name) {
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
      subject: 'Welcome to BharatGPT! 🇮🇳 (Google Sign-in)',
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
              background: linear-gradient(135deg, #4285f4, #34a853);
              color: white;
              padding: 25px;
              border-radius: 8px;
              text-align: center;
              margin: 25px 0;
            }
            .google-badge {
              display: inline-flex;
              align-items: center;
              background: white;
              color: #333;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              margin-top: 10px;
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
              <p>You've successfully signed up using Google!</p>
              <div class="google-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google Account Verified
              </div>
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
              <p>Your Google account makes it easy to access BharatGPT securely without remembering another password!</p>
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
    console.log('Google welcome email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending Google welcome email:', error);
    return { success: false, error: error.message };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
