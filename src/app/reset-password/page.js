'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import OTPInput from '@/components/OTPInput';

export default function ResetPassword() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verificationToken, setVerificationToken] = useState('');

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

  const validateEmail = () => {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateNewPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const sendResetOTP = async () => {
    if (!validateEmail()) return;

    setIsSubmitting(true);
    setOtpError('');

    try {
      const response = await fetch('/api/auth/send-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset code');
      }

      setCurrentStep(2);
      setResendCountdown(60);
      toast.success('Password reset code sent to your email!');
    } catch (error) {
      console.error('Send Reset OTP Error:', error);
      toast.error(error.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPComplete = async (otp) => {
    setIsSubmitting(true);
    setOtpError('');

    try {
      const response = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setVerificationToken(data.verificationToken);
      setCurrentStep(3);
      toast.success('Code verified! Now set your new password.');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setOtpError(error.message || 'Invalid code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!validateNewPassword()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          newPassword: newPassword,
          verificationToken: verificationToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast.success('Password reset successful! You can now login with your new password.');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Password Reset Error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = () => {
    sendResetOTP();
  };

  const goBackToEmail = () => {
    setCurrentStep(1);
    setOtpError('');
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Head>
        <title>Reset Password | BharatGPT</title>
        <meta name="description" content="Reset your BharatGPT account password securely via email verification." />
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
              <span className="text-saffron">Reset</span>{' '}
              <span className="text-green-700">Password</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-saffron to-green-700 mx-auto rounded"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Securely reset your password using email verification
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-saffron' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep >= 1 ? 'border-saffron bg-saffron text-white' : 'border-gray-300'}`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Email</span>
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-saffron' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-saffron' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep >= 2 ? 'border-saffron bg-saffron text-white' : 'border-gray-300'}`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">Verify</span>
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-saffron' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-saffron' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep >= 3 ? 'border-saffron bg-saffron text-white' : 'border-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Reset</span>
              </div>
            </div>
          </div>

          {/* Reset Password Steps */}
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {/* Step 1: Email Input */}
              {currentStep === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); sendResetOTP(); }} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Enter Your Email
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We&apos;ll send you a verification code to reset your password
                    </p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-saffron to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-saffron transition-all font-medium text-lg shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Code...
                      </div>
                    ) : (
                      'Send Reset Code'
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-gray-600">
                      Remember your password?{' '}
                      <Link href="/login" className="text-saffron hover:text-green-700 font-medium">
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {currentStep === 2 && (
                <div>
                  <div className="text-center mb-6">
                    <button
                      onClick={goBackToEmail}
                      className="inline-flex items-center text-gray-600 hover:text-saffron transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to email
                    </button>
                  </div>
                  
                  <OTPInput
                    email={email}
                    onComplete={handleOTPComplete}
                    onResend={handleResendOTP}
                    isLoading={isSubmitting}
                    resendCountdown={resendCountdown}
                    error={otpError}
                    purpose="password reset"
                  />
                </div>
              )}

              {/* Step 3: New Password */}
              {currentStep === 3 && (
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Set New Password
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choose a strong password for your account
                    </p>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-gray-700 mb-2 font-medium">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                        placeholder="Enter new password (min. 6 characters)"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isSubmitting}
                      >
                        {showNewPassword ? (
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

                  <div>
                    <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-medium">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                        placeholder="Confirm your new password"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? (
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium text-lg shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
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
