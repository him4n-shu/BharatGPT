# 🇮🇳 BharatGPT - Your DESI AI Assistant

[![Next.js](https://img.shields.io/badge/Next.js-13.0+-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0+-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **AI-powered assistance for government services in Indian languages**

BharatGPT is a comprehensive AI assistant designed specifically for Indian citizens to navigate government services, schemes, and daily challenges with ease. Built with modern web technologies and featuring multiple authentication methods, it provides a seamless experience for users across India.

## 🌟 **Live Demo**

🔗 **[Visit BharatGPT](https://bharat-gpt-six.vercel.app)**

## 📋 **Table of Contents**

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔐 Authentication](#-authentication)
- [🛠️ Configuration](#️-configuration)
- [📱 Services](#-services)
- [🎨 UI/UX](#-uiux)
- [🌐 API](#-api)
- [📧 Email System](#-email-system)
- [🔒 Security](#-security)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ **Features**

### 🎯 **Core Functionality**
- **AI-Powered Chat Interface** - Get instant answers about government schemes and services
- **Voice Input Support** - Speak your queries in multiple Indian languages
- **Real-time Responses** - Powered by OpenAI GPT-4 for accurate information
- **Multi-language Support** - Hindi and English interface with more languages coming

### 🔐 **Advanced Authentication System**
- **Traditional Email/Password Login** - Standard secure authentication
- **OTP-based Passwordless Login** - Email-based one-time password system
- **Google OAuth Integration** - One-click sign-in with Google accounts
- **Password Reset Functionality** - Secure password recovery with OTP verification
- **Multi-step Registration** - Email verification with OTP for new users

### 📱 **Government Services**
- **🏛️ Sarkari Sahayak** - Simplified summaries of government schemes (PMAY, PM Kisan, etc.)
- **📝 Form Bharna Made Easy** - AI explains government form fields (50+ forms supported)
- **🌾 Kisan Bot** - Weather info, mandi prices, crop suggestions for farmers
- **💰 Paise Ki Bachat** - Weekly money-saving tips and subsidy information
- **🚨 Suraksha Sahayata** - Emergency numbers and local helplines
- **👴 Elderly Care** - Comprehensive support for senior citizens

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Framer Motion Animations** - Smooth, professional animations
- **Tricolor Theme** - Indian flag-inspired design elements
- **Dark/Light Mode Support** - Comfortable viewing in any lighting
- **Accessibility Features** - Screen reader compatible and keyboard navigation

## 🏗️ **Architecture**

### **Frontend**
- **Framework**: Next.js 13+ with App Router
- **UI Library**: React 18+ with TypeScript support
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion for smooth interactions
- **Icons**: React Icons and custom SVG assets

### **Backend**
- **API Routes**: Next.js API routes for serverless functions
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js for OAuth and JWT for traditional auth
- **Email Service**: Nodemailer with Gmail SMTP

### **Deployment**
- **Platform**: Vercel with automatic deployments
- **CDN**: Vercel Edge Network for global performance
- **Environment**: Secure environment variable management

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/yourusername/bharatgpt.git
cd bharatgpt

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## ⚙️ **Installation**

### **Prerequisites**
- Node.js 18.0 or later
- MongoDB database (local or cloud)
- Google OAuth credentials (for Google sign-in)
- Gmail app password (for email services)

### **Step-by-Step Setup**

1. **Clone and Install**
   ```bash
   git clone https://github.com/him4n-shu/BharatGPT
   cd bharatgpt
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_MAX_POOL_SIZE=5
   MONGODB_MIN_POOL_SIZE=1
   MONGODB_MAX_IDLE_TIME_MS=60000

   # Authentication
   JWT_SECRET=your_jwt_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Email Service
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password

   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)

4. **MongoDB Setup**
   - Create a MongoDB database (local or MongoDB Atlas)
   - Add your connection string to `MONGODB_URI`
   - The app will automatically create required collections

5. **Gmail Configuration**
   - Enable 2-Factor Authentication on your Gmail account
   - Generate an App Password for the application
   - Use this App Password in `EMAIL_PASS`

## 🔐 **Authentication**

### **Supported Methods**

#### **1. Traditional Email/Password**
- Secure bcrypt password hashing
- JWT token-based sessions
- Password strength validation
- Remember me functionality

#### **2. OTP-based Passwordless**
- Email-based OTP system
- 6-digit numeric codes
- 5-minute expiry with rate limiting
- Resend functionality with cooldown

#### **3. Google OAuth**
- One-click sign-in/sign-up
- Automatic email verification
- Profile image integration
- Secure OAuth 2.0 flow

### **Security Features**
- CSRF protection
- Rate limiting on authentication endpoints
- Secure cookie settings
- Input validation and sanitization
- SQL injection prevention

## 🛠️ **Configuration**

### **Development**
```bash
# Start development server
npm run dev

# Run with debugging
npm run dev -- --inspect

# Build for production
npm run build

# Start production server
npm start
```

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret for JWT token signing | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for AI responses | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `EMAIL_USER` | Gmail address for sending emails | ✅ |
| `EMAIL_PASS` | Gmail app password | ✅ |
| `NEXTAUTH_SECRET` | NextAuth secret key | ✅ |
| `NEXTAUTH_URL` | Application base URL | ✅ |

## 📱 **Services**

### **🏛️ Sarkari Sahayak**
Get simplified explanations of government schemes:
- PM Awas Yojana (PMAY)
- PM Kisan Samman Nidhi
- Ayushman Bharat
- And 50+ more schemes

### **📝 Form Bharna Made Easy**
AI-powered form assistance:
- Ration card applications
- Passport forms
- Aadhaar updates
- PAN card applications
- Field-by-field explanations

### **🌾 Kisan Bot**
Farmer-specific services:
- Real-time weather updates
- Mandi price information
- Crop recommendations
- Seasonal farming tips
- Government schemes for farmers

### **💰 Paise Ki Bachat**
Financial assistance:
- Money-saving tips
- Subsidy information
- Investment guidance
- Government benefits
- Weekly newsletters

### **🚨 Suraksha Sahayata**
Emergency services:
- Location-based emergency numbers
- Police helplines
- Fire department contacts
- Ambulance services
- Women's helplines

### **👴 Elderly Care**
Senior citizen support:
- Healthcare assistance
- Government scheme guidance
- Pension information
- Senior-friendly tutorials
- Family support resources

## 🎨 **UI/UX**

### **Design System**
- **Colors**: Indian tricolor-inspired palette
- **Typography**: Clean, readable fonts with Hindi support
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable, accessible components

### **Responsive Design**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly interactions
- Optimized for all screen sizes

### **Accessibility**
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- High contrast mode support
- Alt text for all images

## 🌐 **API**

### **Authentication Endpoints**


POST /api/auth/login
POST /api/auth/register-with-otp
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/send-reset-otp
POST /api/auth/verify-reset-otp
POST /api/auth/reset-password
GET  /api/auth/[...nextauth] 

### **AI Chat Endpoint**


POST /api/gpt4
// Request body: { query: string }
// Response: { results: Array<{title, content, link}> }
```

### **User Management**


GET  /api/user/profile
PUT  /api/user/profile
POST /api/user/change-password
```

### **API Response Format**


// Success Response
{
  success: true,
  data: any,
  message?: string
}

// Error Response
{
  success: false,
  error: string,
  details?: any
}
```

## 📧 **Email System**

### **Email Templates**
- **Welcome Email** - For new registrations
- **OTP Verification** - For authentication
- **Password Reset** - For password recovery
- **Google Welcome** - For Google OAuth users

### **Email Features**
- HTML templates with inline CSS
- Mobile-responsive design
- Indian design elements
- Automatic retry mechanism
- Delivery status tracking

### **Configuration**
```javascript
// Nodemailer configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## 🔒 **Security**

### **Data Protection**
- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiration
- Environment variable protection
- Input validation and sanitization
- XSS protection

### **Authentication Security**
- Rate limiting on login attempts
- OTP expiry and attempt limits
- Secure cookie settings
- CSRF token validation
- OAuth state parameter validation

### **Database Security**
- MongoDB connection with authentication
- Indexed sensitive fields
- Data validation at schema level
- Soft delete for user data
- Audit logging for admin actions

## 🚀 **Deployment**

### **Vercel Deployment**

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Enable automatic deployments

2. **Environment Variables**
   Add all production environment variables in Vercel dashboard:
   ```env
   MONGODB_URI=production_mongodb_uri
   NEXTAUTH_URL=https://your-domain.com
   GOOGLE_CLIENT_ID=production_google_client_id
   # ... other variables
   ```

3. **Domain Configuration**
   - Add custom domain in Vercel
   - Update Google OAuth authorized domains
   - Update NEXTAUTH_URL to production domain

### **Performance Optimization**
- Next.js automatic code splitting
- Image optimization with Next.js Image
- Static generation where possible
- Edge runtime for API routes
- Compression and minification

### **Monitoring**
- Vercel Analytics integration
- Error tracking with console logging
- Performance monitoring
- User behavior analytics

## 🧪 **Testing**

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Test Coverage**
- Unit tests for utility functions
- Integration tests for API routes
- Component testing with React Testing Library
- E2E tests with Cypress

## 🤝 **Contributing**

We welcome contributions to BharatGPT! Here's how you can help:

### **Development Process**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Contribution Guidelines**
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass
- Use descriptive commit messages

### **Areas for Contribution**
- 🌐 Additional language support
- 🎨 UI/UX improvements
- 🔧 New government services
- 📱 Mobile app development
- 🧪 Testing and quality assurance
- 📖 Documentation improvements

## 📊 **Project Statistics**

- **Total Files**: 50+ components and pages
- **Authentication Methods**: 3 (Email/Password, OTP, Google OAuth)
- **Government Services**: 6 specialized services
- **Supported Languages**: 2 (English, Hindi) with more coming
- **API Endpoints**: 15+ secure endpoints
- **Email Templates**: 5 responsive templates

## 🛣️ **Roadmap**

### **Phase 1** ✅ (Completed)
- [x] Basic AI chat interface
- [x] User authentication system
- [x] Government services integration
- [x] Mobile-responsive design

### **Phase 2** ✅ (Completed)
- [x] OTP-based authentication
- [x] Google OAuth integration
- [x] Password reset functionality
- [x] Enhanced user profiles

### **Phase 3** 🚧 (In Progress)
- [ ] Mobile application (React Native)
- [ ] Additional Indian languages
- [ ] Voice output (text-to-speech)
- [ ] Offline mode support

### **Phase 4** 📋 (Planned)
- [ ] WhatsApp bot integration
- [ ] SMS-based services
- [ ] Government API integrations
- [ ] Advanced analytics dashboard

## 📞 **Support**

### **Getting Help**
- 📧 Email: support@bharatgpt.com
- 💬 GitHub Issues: [Report a bug](https://github.com/him4n-shu)

### **Community**
- 🌟 Star the repository if you find it useful
- 🍴 Fork and contribute to the project
- 📢 Share with other developers

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **OpenAI** for providing the GPT-4 API
- **Vercel** for excellent hosting and deployment
- **MongoDB** for reliable database services
- **Next.js team** for the amazing framework
- **Contributors** who help improve the project

---

## 🇮🇳 **Made with ❤️ for India**

BharatGPT is built with the vision of making government services accessible to every Indian citizen, regardless of their technical expertise or language preference. We believe that technology should serve the people, and this project is our contribution to Digital India.

**Jai Hind! 🇮🇳**

---

<div align="center">

### 🌟 **Star the Repository**

If you find BharatGPT useful, please ⭐ star the repository to show your support!

[![GitHub stars](https://img.shields.io/github/stars/him4n-shu/BharatGPT.svg?style=social&label=Star)](https://github.com/him4n-shu/BharatGPT)

</div>
