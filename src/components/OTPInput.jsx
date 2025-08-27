'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OTPInput({ 
  length = 6, 
  onComplete, 
  onResend, 
  email, 
  isLoading = false, 
  resendCountdown = 0,
  error = '',
  purpose = 'verification' 
}) {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (error) {
      // Clear OTP when there's an error
      setOtp(new Array(length).fill(''));
      setActiveIndex(0);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }, [error, length]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    
    // Handle pasted content
    if (value.length > 1) {
      const pastedData = value.slice(0, length);
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      
      // Focus on the last filled input or next empty one
      const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
      setActiveIndex(lastFilledIndex);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
      
      // Check if OTP is complete
      if (pastedData.length >= length) {
        onComplete(newOtp.join(''));
      }
      return;
    }

    // Handle single character input
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current is filled
    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === length) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current input
        handleChange(index, '');
      } else if (index > 0) {
        // Move to previous input and clear it
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
        handleChange(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index) => {
    setActiveIndex(index);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (digits) {
      const newOtp = new Array(length).fill('');
      for (let i = 0; i < digits.length && i < length; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      
      // Focus on the last filled input
      const lastIndex = Math.min(digits.length - 1, length - 1);
      setActiveIndex(lastIndex);
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].focus();
      }
      
      // Check if complete
      if (digits.length >= length) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Enter Verification Code
        </h3>
        <p className="text-gray-600">
          We've sent a 6-digit code to <span className="font-medium text-saffron">{email}</span>
        </p>
        {purpose === 'login' && (
          <p className="text-sm text-green-700 mt-1">Verifying for login</p>
        )}
        {purpose === 'registration' && (
          <p className="text-sm text-green-700 mt-1">Verifying for registration</p>
        )}
      </div>

      {/* OTP Input Fields */}
      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            pattern="\d{1}"
            maxLength={6} // Allow paste of full OTP
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onPaste={handlePaste}
            disabled={isLoading}
            className={`
              w-12 h-12 text-center text-lg font-bold border-2 rounded-lg
              transition-all duration-200 outline-none
              ${digit ? 'border-saffron bg-saffron/5' : 'border-gray-300'}
              ${activeIndex === index ? 'ring-2 ring-saffron ring-opacity-30' : ''}
              ${error ? 'border-red-400 bg-red-50' : ''}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-saffron/50'}
              focus:border-saffron focus:ring-2 focus:ring-saffron focus:ring-opacity-30
            `}
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-center mb-4"
        >
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-center gap-2 text-saffron">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-saffron"></div>
            <span className="text-sm">Verifying...</span>
          </div>
        </motion.div>
      )}

      {/* Resend Section */}
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-3">
          Didn't receive the code?
        </p>
        
        {resendCountdown > 0 ? (
          <div className="text-gray-500 text-sm">
            Resend available in {formatTime(resendCountdown)}
          </div>
        ) : (
          <button
            onClick={onResend}
            disabled={isLoading}
            className={`
              text-saffron hover:text-green-700 font-medium text-sm
              transition-colors duration-200 underline
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}
            `}
          >
            Resend OTP
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs text-blue-700">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check your spam/junk folder if you don't see the email</li>
            <li>The code expires in 5 minutes</li>
            <li>You can paste the entire code at once</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
