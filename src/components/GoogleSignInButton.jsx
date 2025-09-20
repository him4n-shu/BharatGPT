'use client';
import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function GoogleSignInButton({ 
  text = "Continue with Google", 
  mode = "signin", // "signin" or "signup"
  className = "",
  onSuccess = null 
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.error) {
        console.error('Google sign-in error:', result.error);
        
        // Handle specific OAuth errors
        if (result.error === 'OAuthAccountNotLinked') {
          toast.error('This account is already linked to another sign-in method. Please use your original sign-in method or contact support.');
        } else if (result.error === 'OAuthCallback') {
          toast.error('OAuth authentication failed. Please check your internet connection and try again.');
        } else if (result.error === 'AccessDenied') {
          toast.error('Access denied. Please allow the required permissions and try again.');
        } else {
          toast.error('Failed to sign in with Google. Please try again.');
        }
      } else if (result?.ok) {
        // Get the session to access user data
        const session = await getSession();
        
        if (session?.user) {
          // Store user data in localStorage for compatibility with existing app
          const userData = {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            provider: 'google',
            isEmailVerified: true,
            createdAt: new Date().toISOString(),
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Call success callback if provided
          if (onSuccess) {
            onSuccess(userData);
          } else {
            // Default behavior - show success message and redirect
            toast.success(`Successfully signed ${mode === 'signup' ? 'up' : 'in'} with Google!`);
            // Force page reload to update navbar state
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        }
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      toast.error('An error occurred during Google authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`
        relative w-full flex items-center justify-center px-4 py-3 
        border border-gray-300 rounded-lg text-gray-700 bg-white 
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 transition-all duration-200 font-medium
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-3"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{text}</span>
        </div>
      )}
    </button>
  );
}
