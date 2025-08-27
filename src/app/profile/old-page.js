'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Error loading profile data');
        // Redirect to login if user data is invalid
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } else {
      // Redirect to login if no user data found
      window.location.href = '/login';
      return; 
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-saffron"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif font-extrabold mb-4 tracking-tight">
            <span className="text-saffron">Your</span>{' '}
            <span className="text-green-700">Profile</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-saffron to-green-700 mx-auto rounded"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Manage your BharatGPT account and preferences
          </p>
        </motion.div>

        {user && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 bg-gradient-to-r from-saffron to-green-700 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{user.name}</h2>
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="text-gray-800 font-medium">{user.email}</p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-gray-500 text-sm">Account Type</p>
                      <p className="text-gray-800 font-medium">{user.role || 'Standard User'}</p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-gray-500 text-sm">Member Since</p>
                      <p className="text-gray-800 font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/" className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all">
                      Back to Home
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-600 text-center italic">
                    Your recent activities will appear here.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="light" />
    </div>
  );
}