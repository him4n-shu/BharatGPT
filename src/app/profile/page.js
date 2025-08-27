'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import { useSession, signOut } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  // Helper function to calculate membership duration
  const calculateMembershipDuration = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return 'Joined today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      if (years === 1) {
        return remainingMonths > 0 ? `1 year, ${remainingMonths} months ago` : '1 year ago';
      } else {
        return remainingMonths > 0 ? `${years} years, ${remainingMonths} months ago` : `${years} years ago`;
      }
    }
  };

  useEffect(() => {
    // First check NextAuth session
    if (session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        provider: 'google',
        isEmailVerified: true,
        createdAt: new Date().toISOString(), // Default for Google users
        role: 'Standard User'
      });
      setIsLoading(false);
    } else if (status === 'loading') {
      // Still loading session
      return;
    } else {
      // Fallback to localStorage for traditional auth
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
    }
  }, [session, status]);

  const handleLogout = async () => {
    // Check if user is signed in via NextAuth (Google)
    if (session) {
      await signOut({ redirect: false });
    }
    
    // Clear localStorage for traditional auth
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
                <div className="w-32 h-32 bg-gradient-to-r from-saffron to-green-700 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {user.image ? (
                    <Image 
                      src={user.image} 
                      alt={user.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{user.name}</h2>
                  
                                     <div className="space-y-4">
                     <div className="border-b border-gray-200 pb-3">
                       <p className="text-gray-500 text-sm">Email</p>
                       <p className="text-gray-800 font-medium">{user.email}</p>
                       {user.isEmailVerified && (
                         <span className="inline-flex items-center mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                           ✅ Verified
                         </span>
                       )}
                     </div>

                     {user.mobileNumber && (
                       <div className="border-b border-gray-200 pb-3">
                         <p className="text-gray-500 text-sm">Mobile Number</p>
                         <p className="text-gray-800 font-medium">{user.mobileNumber}</p>
                       </div>
                     )}
                     
                     <div className="border-b border-gray-200 pb-3">
                       <p className="text-gray-500 text-sm">Account Type</p>
                       <div className="flex items-center gap-2">
                         <p className="text-gray-800 font-medium">{user.role || 'Standard User'}</p>
                         {user.provider === 'google' && (
                           <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                             <svg width="12" height="12" viewBox="0 0 24 24" className="mr-1">
                               <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                               <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                               <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                               <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                             </svg>
                             Google
                           </span>
                         )}
                       </div>
                     </div>
                     
                     <div className="border-b border-gray-200 pb-3">
                       <p className="text-gray-500 text-sm">Member Since</p>
                       <p className="text-gray-800 font-medium">
                         {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric'
                         }) : 'N/A'}
                       </p>
                       {user.createdAt && (
                         <p className="text-gray-400 text-xs mt-1">
                           {calculateMembershipDuration(user.createdAt)}
                         </p>
                       )}
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