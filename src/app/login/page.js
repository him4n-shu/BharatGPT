'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error('Valid email is required!');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return false;
    }
    return true;
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
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      toast.success('Login successful! Redirecting...');
  
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      console.error('Login Error:', error);
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-saffron focus:ring-green-700 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-saffron hover:text-green-700">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-saffron to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-saffron transition-all font-medium text-lg shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center mt-4">
                  <p className="text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-saffron hover:text-green-700 font-medium">
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="light" />
      </div>
    </>
  );
}