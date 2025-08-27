'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import OTPInput from '@/components/OTPInput';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const validateForm = () => {
    if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error('Valid email is required!');
      return false;
    }
    if (loginMethod === 'password' && (!formData.password || formData.password.length < 6)) {
      toast.error('Password must be at least 6 characters!');
      return false;
    }
    return true;
  };

  const sendOTP = async () => {
    if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setOtpError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          purpose: 'login',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      setResendCountdown(60); // 1 minute countdown
      toast.success('OTP sent to your email!');
    } catch (error) {
      console.error('Send OTP Error:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPComplete = async (otp) => {
    setIsSubmitting(true);
    setOtpError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: otp,
          purpose: 'login',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      // OTP verified successfully, now complete login
      await completeLogin();
      
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setOtpError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeLogin = async () => {
    try {
      // For OTP login, we just need to fetch user data and create session
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          loginMethod: 'otp', // Indicate this is OTP login
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      toast.success('Login successful! Redirecting...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Complete Login Error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  const handleResendOTP = () => {
    sendOTP();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      toast.success('Login successful! Redirecting...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Login Error:', error);
      toast.error(error.message === 'Invalid server response' 
        ? 'Server error. Please try again later.'
        : error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login to BharatGPT | Access Your Account</title>
        <meta name="description" content="Log in to your BharatGPT account to access personalized government services and information." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <Image
                src="/bg-logo.png"
                alt="BharatGPT Logo"
                width={120}
                height={120}
                className="rounded-full shadow-lg"
                priority
              />
            </div>
            <h1 className="text-5xl font-serif font-extrabold mb-4 tracking-tight">
              <span className="text-saffron">Login</span>{' '}
              <span className="text-green-700">to BharatGPT</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-saffron to-green-700 mx-auto rounded"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Access your personalized government services and information
            </p>
          </motion.div>

          {/* Login Form */}
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {/* Login Method Toggle */}
              <div className="mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('password');
                      setOtpSent(false);
                      setOtpError('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      loginMethod === 'password'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🔑 Password Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('otp');
                      setOtpSent(false);
                      setOtpError('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      loginMethod === 'otp'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📱 OTP Login
                  </button>
                </div>
              </div>

              {/* Conditional rendering based on login method and OTP state */}
              {loginMethod === 'otp' && otpSent ? (
                <OTPInput
                  email={formData.email}
                  onComplete={handleOTPComplete}
                  onResend={handleResendOTP}
                  isLoading={isSubmitting}
                  resendCountdown={resendCountdown}
                  error={otpError}
                  purpose="login"
                />
              ) : (
                <form onSubmit={loginMethod === 'otp' ? (e) => { e.preventDefault(); sendOTP(); } : handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {loginMethod === 'password' && (
                    <div>
                      <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                          placeholder="Enter your password"
                          required
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {loginMethod === 'password' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-saffron focus:ring-green-700 border-gray-300 rounded"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <Link
                          href="/reset-password"
                          className="font-medium text-saffron hover:text-green-700"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  )}

                  {loginMethod === 'otp' && !otpSent && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">
                            Login with OTP
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>
                              We'll send a 6-digit verification code to your email address.
                              This is a secure way to access your account without a password.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-saffron to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-saffron transition-all font-medium text-lg shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {loginMethod === 'otp' ? 'Sending OTP...' : 'Logging in...'}
                      </div>
                    ) : (
                      loginMethod === 'otp' ? 'Send OTP' : 'Login'
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-gray-600">
                      Don&apos;t have an account?{' '}
                      <Link href="/register" className="text-saffron hover:text-green-700 font-medium">
                        Register here
                      </Link>
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="my-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                  </div>

                  {/* Google Sign-in Button */}
                  <GoogleSignInButton 
                    text="Sign in with Google"
                    mode="signin"
                  />
                </form>
              )}
            </motion.div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="light" />
      </div>
    </>
  );
}