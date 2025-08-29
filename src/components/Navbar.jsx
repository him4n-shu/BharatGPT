'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { navLinks, bharatGPTServices } from '../constants/data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchRef = useRef(null);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is logged in (localStorage or NextAuth session)
  useEffect(() => {
    // First check NextAuth session
    if (session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        provider: 'google',
        isEmailVerified: true
      });
    } else {
      // Fallback to localStorage for traditional auth
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
      }
    }
  }, [session]);

  // Search functionality
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = bharatGPTServices.filter(service => {
      const searchFields = [
        service.name,
        service.description,
        service.category,
        service.keywords,
        ...service.tags
      ].join(' ').toLowerCase();
      
      return searchFields.includes(searchTerm);
    });

    // Sort results: exact matches first, then partial matches
    results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      if (aName.includes(searchTerm) && !bName.includes(searchTerm)) return -1;
      if (!aName.includes(searchTerm) && bName.includes(searchTerm)) return 1;
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      
      return 0;
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  // Handle search result click
  const handleSearchResultClick = (service) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    router.push(service.url);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.user-dropdown');
      const button = document.querySelector('.user-dropdown-button');
      if (showDropdown && dropdown && !dropdown.contains(event.target) && !button.contains(event.target)) {
        setShowDropdown(false);
      }

      if (showSearchResults && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showSearchResults]);
  
  // Handle logout
  const handleLogout = async () => {
    // Check if user is signed in via NextAuth (Google)
    if (session) {
      await signOut({ redirect: false });
    }
    
    // Clear localStorage for traditional auth
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    setUser(null);
    setShowDropdown(false);
    window.location.href = '/';
  };

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
              <div className="flex items-center">
                <Image
                  src="/bg-logo.png"
                  alt="BharatGPT Logo"
                  width={83}
                  height={60}
                  className="rounded-full mr-2"
                  priority
                />
                <motion.span
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span style={{ color: '#FF9933' }}>Bharat</span>
                  <span style={{ color: '#ffffff' }}>GPT</span>
                </motion.span>
              </div>
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
              ref={searchRef}
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search services..."
                  className="form-input-focus px-4 py-2 pr-8 rounded-full w-64"
                  style={{
                    backgroundColor: '#2D2D2D',
                    color: '#ffffff',
                    border: '1px solid #FF9933',
                  }}
                  aria-label="Search government services"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                    style={{ color: '#ffffff' }}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="p-2">
                      <div className="text-xs text-gray-500 px-3 py-2 border-b">
                        {searchResults.length} service{searchResults.length !== 1 ? 's' : ''} found
                      </div>
                      {searchResults.map((service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSearchResultClick(service)}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                        >
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg mr-3 flex-shrink-0"
                            style={{ backgroundColor: service.color }}
                          >
                            {service.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900 truncate">
                                {service.name}
                              </h4>
                              {service.popular && (
                                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {service.description}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {service.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-400 ml-2">
                            →
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* No Results Message */}
              <AnimatePresence>
                {showSearchResults && searchQuery && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="p-4 text-center text-gray-500">
                      <div className="text-2xl mb-2">🔍</div>
                      <p>No services found for "{searchQuery}"</p>
                      <p className="text-sm mt-1">Try searching for "forms", "schemes", or "emergency"</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Desktop Nav Links */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <motion.div key={link.path} whileHover={{ scale: 1.1, color: '#FF9933' }}>
                  <Link href={link.path} className="nav-link">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <motion.div 
                  className="relative flex items-center"
                >
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="cta-button flex items-center user-dropdown-button"
                    style={{
                      background: 'linear-gradient(to right, #FF9933, #138808)',
                    }}
                    aria-label="User menu"
                    aria-expanded={showDropdown}
                  >
                    <span>{user.name}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* User dropdown menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 user-dropdown">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
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
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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
                {/* Mobile Search */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search services..."
                      className="w-full px-4 py-2 pr-8 rounded-full"
                      style={{
                        backgroundColor: '#3D3D3D',
                        color: '#ffffff',
                        border: '1px solid #FF9933',
                      }}
                      aria-label="Search government services"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowSearchResults(false);
                        }}
                        className="absolute right-2 top-2 text-gray-400 hover:text-white"
                        style={{ color: '#ffffff' }}
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  {/* Mobile Search Results */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="mt-2 bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-400 px-3 py-2 border-b border-gray-700">
                        {searchResults.length} service{searchResults.length !== 1 ? 's' : ''} found
                      </div>
                      {searchResults.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => {
                            handleSearchResultClick(service);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-3 flex-shrink-0"
                            style={{ backgroundColor: service.color }}
                          >
                            {service.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white text-sm truncate">
                                {service.name}
                              </h4>
                              {service.popular && (
                                <span className="bg-orange-600 text-orange-100 text-xs px-1 py-0.5 rounded">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-1">
                              {service.description}
                            </p>
                          </div>
                          <div className="text-gray-400 ml-2">
                            →
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showSearchResults && searchQuery && searchResults.length === 0 && (
                    <div className="mt-2 bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-lg mb-1">🔍</div>
                      <p className="text-gray-400 text-sm">No services found for "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>

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
                {user ? (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/profile"
                        className="cta-button block text-center"
                        style={{
                          background: 'linear-gradient(to right, #FF9933, #138808)',
                        }}
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="View Profile"
                      >
                        {user.name}
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="cta-button block text-center w-full"
                        style={{
                          background: '#e53e3e',
                        }}
                        aria-label="Logout"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
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
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tricolor Stripe (Static) */}
      <div className="flex h-1">
        <div className="bg-[#FF9933] w-1/3 h-full"></div>
        <div className="bg-white w-1/3 h-full"></div>
        <div className="bg-[#138808] w-1/3 h-full"></div>
      </div>
    </nav>
  );
}