'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaSearch } from 'react-icons/fa';
import { RiGovernmentFill } from 'react-icons/ri';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

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

  const handleVoiceInput = () => {
    setIsListening(!isListening);
  };

  const features = [
    { icon: '🇮🇳', text: "12+ Indian Languages" },
    { icon: '📝', text: "Auto-Form Filler" },
    { icon: '🔊', text: "Voice Assistant" },
    { icon: '⚡', text: "Instant Results" },
    { icon: '🔒', text: "Aadhaar Secure" },
    { icon: '🏛️', text: "Govt Approved" }
  ];

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
          <form className="hero-search-form">
            <div className="hero-search-input-container">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={suggestions[currentSuggestion]}
                className="hero-search-input"
              />
              <div className="hero-search-buttons">
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`hero-voice-btn ${isListening ? 'listening' : ''}`}
                >
                  {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
                <button type="submit" className="hero-search-btn">
                  <FaSearch />
                </button>
              </div>
            </div>
            <button type="submit" className="hero-cta-btn">
              Ask BharatGPT
            </button>
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

        {/* Illustration */}
        <div className="hero-illustration">
          <div className="hero-illustration-main">
            <div className="hero-illustration-emoji">🇮🇳</div>
            <div className="hero-illustration-badge">
              <span>Live</span> Assistance
            </div>
          </div>
          {/* Floating elements */}
          <div className="hero-illustration-float-1"></div>
          <div className="hero-illustration-float-2"></div>
        </div>
      </div>
    </section>
  );
}