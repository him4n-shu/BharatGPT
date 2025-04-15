'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaSearch } from 'react-icons/fa';
import { RiGovernmentFill } from 'react-icons/ri';
import useVoiceInput from '../hooks/useVoiceInput';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [voiceError, setVoiceError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isListening, startListening, stopListening, transcript, error, resetTranscript } = useVoiceInput();

  // Auto-rotate suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const suggestions = [
    "How to apply for a ration card?",
    "10वीं का सर्टिफिकेट खो गया है",
    "LPG subsidy status check",
    "आंगनवाड़ी फॉर्म कैसे भरें?"
  ];

  // Update query when transcript changes
  useEffect(() => {
    if (transcript && isListening) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

  // Handle voice recognition errors
  useEffect(() => {
    if (error) {
      setVoiceError(error);
      const timer = setTimeout(() => setVoiceError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setQuery(transcript);
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  const features = [
    { icon: '🇮🇳', text: "12+ Indian Languages" },
    { icon: '📝', text: "Auto-Form Filler" },
    { icon: '🔊', text: "Voice Assistant" },
    { icon: '⚡', text: "Instant Results" },
    { icon: '🔒', text: "Aadhaar Secure" },
    { icon: '🏛️', text: "Govt Approved" }
  ];

  // Handle search submission
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/gpt4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setSearchResults([{
        title: 'Error',
        content: 'Sorry, we encountered an error while processing your request. Please try again.',
        link: null
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="hero-section">
      {/* Background Elements */}
      <div className="hero-bg-overlay"></div>
      <div className="hero-bg-lights"></div>
      
      <div className="hero-container">
        {/* Text Content */}
        <div className="hero-text-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-badge"
          >
            <RiGovernmentFill className="hero-badge-icon" />
            <span>Official Partner</span>
          </motion.div>

          <h1 className="hero-title">
            <span className="hero-title-accent">Bharat</span>GPT
            <span className="hero-subtitle">Your Desi AI Assistant</span>
          </h1>

          <p className="hero-description">
            Solving <span>real Indian problems</span> in Hindi, Tamil, Marathi and more!
          </p>

          {/* Search Form */}
          <form className="hero-search-form" onSubmit={handleSearch}>
            <div className="hero-search-input-container relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={suggestions[currentSuggestion]}
                className="hero-search-input"
                aria-label="Search query"
              />
              {voiceError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 left-0 right-0 bg-red-500 text-white text-sm p-2 rounded-md z-10"
                >
                  {voiceError}
                </motion.div>
              )}
              <div className="hero-search-buttons">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={handleVoiceInput}
                  className={`hero-voice-btn ${isListening ? 'listening' : ''}`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  aria-pressed={isListening}
                >
                  {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                  {isListening && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </motion.button>
                <motion.button 
                  type="button" 
                  onClick={handleSearch}
                  className="hero-search-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Search"
                >
                  <FaSearch />
                </motion.button>
              </div>
            </div>
            <motion.button 
              type="button" 
              onClick={handleSearch}
              className="hero-cta-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ask BharatGPT
            </motion.button>
          </form>

          {/* Features Grid */}
          <div className="hero-features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="hero-feature-card"
              >
                <div className="hero-feature-icon">{feature.icon}</div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="hero-search-results">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hero-search-results-container animate-fade-in"
          >
            <div className="hero-search-results-header">
              <div className="hero-search-results-badge">
                <span>Live</span> Results
              </div>
              <div className="hero-search-results-emoji">🇮🇳</div>
            </div>
            
            {isLoading ? (
              <div className="hero-search-results-placeholder">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="hero-search-results-placeholder-icon"
                >
                  <FaSearch className="text-4xl text-gray-400" />
                </motion.div>
                <p>Searching for answers...</p>
              </div>
            ) : query ? (
              <div className="hero-search-results-content">
                {searchResults.length > 0 ? (
                  <div className="results-section">
                    {searchResults.map((result, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="hero-search-result-item"
                      >
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                          {typeof result.title === 'string' ? result.title : JSON.stringify(result.title)}
                        </h3>
                        <div 
                          className="prose prose-sm max-w-none mb-4 text-gray-600 bg-white rounded-lg p-6 shadow-sm"
                          style={{ 
                            width: '100%',
                            height: 'auto',
                            position: 'relative',
                            zIndex: 1
                          }}
                        >
                          {result.content.split('\n').map((line, i) => {
                            if (!line.trim()) return null;
                            
                            const isMainPoint = /^\d+\./.test(line);
                            const isBulletPoint = line.trim().startsWith('-') || line.trim().startsWith('•');
                            
                            return (
                              <div 
                                key={i}
                                className={`content-item ${isBulletPoint ? 'ml-6' : ''} ${isMainPoint ? 'main-point' : ''}`}
                                style={{
                                  backgroundColor: 'white',
                                  padding: isMainPoint ? '1rem' : '0.5rem',
                                  borderRadius: '0.5rem',
                                  marginTop: isMainPoint ? '1rem' : '0.25rem',
                                  boxShadow: isMainPoint ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                  borderLeft: isBulletPoint ? '2px solid #e5e7eb' : 'none'
                                }}
                              >
                                {isMainPoint ? (
                                  <strong className="text-lg text-gray-800 block">
                                    {line}
                                  </strong>
                                ) : isBulletPoint ? (
                                  <div className="flex items-start">
                                    <span className="mr-2 text-gray-400">•</span>
                                    <span>{line.replace(/^[-•]\s*/, '')}</span>
                                  </div>
                                ) : (
                                  <span>{line}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {result.link && (
                          <a 
                            href={result.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2"
                          >
                            <span>Official Website</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="hero-search-results-placeholder">
                    <p>No results found. Try a different query.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="hero-search-results-placeholder">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="hero-search-results-placeholder-icon"
                >
                  <FaSearch className="text-4xl text-gray-400" />
                </motion.div>
                <p>Enter your query above to get instant assistance</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}