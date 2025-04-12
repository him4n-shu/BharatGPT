'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; 
import { navLinks } from '../constants/data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const badgeVariants = {
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-gradient-to-b shadow-lg transition-all ${scrolled ? 'py-2' : 'py-3'}`}
      style={{ backgroundImage: 'linear-gradient(to bottom, #1A1A1A, #2D2D2D)', color: '#ffffff' }}
      aria-label="Main navigation"
    >
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo with animated Jai Hind badge */}
          <motion.div className="flex items-center">
            <Link href="/" className="flex items-center group" aria-label="Go to Home">
              <motion.span
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span style={{ color: '#FF9933' }}>Bharat</span>
                <span style={{ color: '#ffffff' }}>GPT</span>
              </motion.span>
              <motion.span
                className="logo-badge ml-2 px-2 py-1 bg-green-100 text-xs rounded-full text-green-800"
                variants={badgeVariants}
                whileHover="hover"
              >
                Jai Hind!
              </motion.span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            {/* Search Bar */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="form-input-focus px-4 py-2 rounded-full"
                style={{
                  backgroundColor: '#2D2D2D',
                  color: '#ffffff',
                  border: '1px solid #FF9933',
                }}
                aria-label="Search government services"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  style={{ color: '#ffffff' }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </motion.div>

            {/* Language Toggle */}
            <motion.button
              onClick={() => setLanguage((lang) => (lang === 'en' ? 'hi' : 'en'))}
              className="px-3 py-1 rounded-full bg-gray-700 text-sm hover:bg-gray-600 transition-all button-press-effect"
              style={{ color: '#ffffff' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </motion.button>

            {/* Desktop Nav Links */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <motion.div key={link.path} whileHover={{ scale: 1.1, color: '#FF9933' }}>
                  <Link href={link.path} className="nav-link">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/get-started"
                  className="cta-button"
                  style={{
                    background: 'linear-gradient(to right, #FF9933, #138808)',
                  }}
                  aria-label="Get Started"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <motion.button
              onClick={() => setLanguage((lang) => (lang === 'en' ? 'hi' : 'en'))}
              className="px-2 py-1 rounded-full bg-gray-700 text-xs hover:bg-gray-600 transition-all button-press-effect"
              style={{ color: '#ffffff' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              {language === 'en' ? 'हिंदी' : 'EN'}
            </motion.button>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
              style={{ color: '#ffffff' }}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9}}
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-gray-700"
              style={{ backgroundColor: '#2D2D2D' }}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <motion.div key={link.path} whileHover={{ scale: 1.05, color: '#FF9933' }}>
                    <Link
                      href={link.path}
                      className="mobile-nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/get-started"
                    className="cta-button block text-center"
                    style={{
                      background: 'linear-gradient(to right, #FF9933, #138808)',
                    }}
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Get Started"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Tricolor Stripe */}
      <motion.div
        className="tricolor-stripe flex h-1"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="tricolor-saffron w-1/3 h-full"></div>
        <div className="tricolor-white w-1/3 h-full"></div>
        <div className="tricolor-green w-1/3 h-full"></div>
      </motion.div>
    </nav>
  );
}