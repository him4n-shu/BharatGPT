'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import useVoiceInput from '@/hooks/useVoiceInput';

export default function ElderlyCare() {
  const { data: session } = useSession();
  
  // Voice input hook
  const {
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
    toggleListening
  } = useVoiceInput({ language: 'hi-IN', silenceTimeout: 3000 });
  
  // State management
  const [activeTab, setActiveTab] = useState('services');
  const [query, setQuery] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const slideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Elderly care services
  const elderlyServices = [
    {
      id: 'healthcare',
      title: 'Healthcare Support',
      icon: '🏥',
      color: 'red',
      description: 'Comprehensive medical care and health monitoring for seniors',
      features: [
        'Home healthcare visits',
        'Medicine delivery service',
        'Regular health checkups',
        'Emergency medical assistance',
        'Specialist consultations',
        'Health monitoring devices'
      ],
      contactInfo: {
        helpline: '104',
        email: 'support@nhp.gov.in',
        website: 'https://www.nhp.gov.in'
      }
    },
    {
      id: 'daily-living',
      title: 'Daily Living Assistance',
      icon: '🧓',
      color: 'green',
      description: 'Support for daily activities and independent living',
      features: [
        'Meal preparation and delivery',
        'Grocery shopping assistance',
        'Personal care support',
        'Mobility assistance',
        'Household maintenance',
        'Transportation services'
      ],
      contactInfo: {
        helpline: '1800-180-1551',
        email: 'info@socialjustice.gov.in',
        website: 'https://socialjustice.gov.in'
      }
    },
    {
      id: 'social-engagement',
      title: 'Social & Mental Wellness',
      icon: '👥',
      color: 'blue',
      description: 'Programs to maintain social connections and mental health',
      features: [
        'Community center activities',
        'Senior citizen clubs',
        'Mental health counseling',
        'Recreation programs',
        'Skill development classes',
        'Volunteer opportunities'
      ],
      contactInfo: {
        helpline: '1800-599-0019',
        email: 'support@kiran.gov.in',
        website: 'https://www.health.gov.in'
      }
    },
    {
      id: 'financial-support',
      title: 'Financial Assistance',
      icon: '💰',
      color: 'yellow',
      description: 'Pension schemes and financial support programs',
      features: [
        'Old Age Pension Scheme',
        'Widow Pension Scheme',
        'Disability Pension',
        'Financial counseling',
        'Insurance guidance',
        'Investment planning'
      ],
      contactInfo: {
        helpline: '1800-180-1551',
        email: 'pension@socialjustice.gov.in',
        website: 'https://nsap.nic.in'
      }
    },
    {
      id: 'legal-support',
      title: 'Legal & Rights Protection',
      icon: '⚖️',
      color: 'purple',
      description: 'Legal assistance and rights protection for elderly',
      features: [
        'Legal consultation',
        'Property rights protection',
        'Elder abuse prevention',
        'Will and testament assistance',
        'Family dispute resolution',
        'Rights awareness programs'
      ],
      contactInfo: {
        helpline: '15100',
        email: 'legal@nalsa.gov.in',
        website: 'https://nalsa.gov.in'
      }
    },
    {
      id: 'emergency-care',
      title: 'Emergency Response',
      icon: '🚨',
      color: 'orange',
      description: '24/7 emergency response and support services',
      features: [
        '24/7 emergency helpline',
        'Medical emergency response',
        'Emergency contact system',
        'GPS tracking devices',
        'Panic button services',
        'Rapid response team'
      ],
      contactInfo: {
        helpline: '112',
        email: 'emergency@gov.in',
        website: 'https://www.dial112.gov.in'
      }
    }
  ];

  // Government schemes
  const governmentSchemes = [
    {
      name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
      description: 'Monthly pension for seniors below poverty line',
      benefit: '₹200-₹500 per month',
      eligibility: 'Age 60+, BPL families',
      icon: '💰',
      applyUrl: 'https://nsap.nic.in/',
      websiteName: 'NSAP Portal'
    },
    {
      name: 'Rashtriya Vayoshri Yojana',
      description: 'Free physical aids and assisted living devices',
      benefit: 'Free mobility aids, hearing aids, etc.',
      eligibility: 'Age 60+, BPL category',
      icon: '🦽',
      applyUrl: 'https://www.india.gov.in/spotlight/rashtriya-vayoshri-yojana',
      websiteName: 'National Portal India'
    },
    {
      name: 'Pradhan Mantri Vaya Vandana Yojana (PMVVY)',
      description: 'Pension scheme with assured returns',
      benefit: '8% assured return for 10 years',
      eligibility: 'Age 60+, investment-based',
      icon: '📈',
      applyUrl: 'https://web.umang.gov.in/landing/department/pmvvy.html',
      websiteName: 'UMANG Portal'
    },
    {
      name: 'Ayushman Bharat for Senior Citizens',
      description: 'Health insurance coverage',
      benefit: 'Up to ₹5 lakhs per family annually',
      eligibility: 'Eligible families under SECC',
      icon: '🏥',
      applyUrl: 'https://www.pmjay.gov.in/',
      websiteName: 'PM-JAY Portal'
    },
    {
      name: 'Senior Citizen Savings Scheme (SCSS)',
      description: 'High-interest savings scheme',
      benefit: 'Higher interest rates',
      eligibility: 'Age 60+, investment up to ₹15 lakhs',
      icon: '🏦',
      applyUrl: 'https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx',
      websiteName: 'India Post'
    },
    {
      name: 'Annapurna Scheme',
      description: 'Food security for destitute elderly',
      benefit: '10 kg food grains per month',
      eligibility: 'Destitute elderly not covered under pension',
      icon: '🍚',
      applyUrl: 'https://dfpd.gov.in/',
      websiteName: 'Dept. of Food & PDS'
    }
  ];

  // Sync voice transcript with query input
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  // Handle voice errors
  useEffect(() => {
    if (voiceError) {
      showMessage(voiceError, 'error');
    }
  }, [voiceError]);

  // Helper functions
  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 5000);
  };

  // Voice control functions
  const handleVoiceStart = () => {
    resetTranscript();
    setQuery('');
    startListening();
  };

  const handleVoiceStop = () => {
    stopListening();
  };

  const handleVoiceClear = () => {
    resetTranscript();
    setQuery('');
    stopListening();
  };

  // Language detection function
  const detectLanguage = (text) => {
    // Simple language detection based on script
    const hindiPattern = /[\u0900-\u097F]/;
    const englishPattern = /[a-zA-Z]/;
    
    const hindiChars = (text.match(hindiPattern) || []).length;
    const englishChars = (text.match(englishPattern) || []).length;
    
    // If more than 30% Hindi characters, consider it Hindi
    const totalChars = text.replace(/\s/g, '').length;
    const hindiPercentage = (hindiChars / totalChars) * 100;
    
    return hindiPercentage > 30 ? 'hindi' : 'english';
  };

  // Handle scheme query
  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setApiResponse(null);
    
    try {
      // Detect the language of the query
      const detectedLanguage = detectLanguage(query);
      
      // Create language-specific context and instructions
      const languageInstructions = detectedLanguage === 'hindi' 
        ? 'Please respond in Hindi (हिंदी में उत्तर दें). Use Devanagari script for the response.'
        : 'Please respond in English.';
      
      const contextMessage = detectedLanguage === 'hindi'
        ? 'elderly care and senior citizen schemes in India (वृद्धावस्था देखभाल और वरिष्ठ नागरिक योजनाएं)'
        : 'elderly care and senior citizen schemes in India';

      const response = await fetch('/api/ask-scheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: `${languageInstructions}\n\nQuestion: ${query}`,
          context: contextMessage,
          language: detectedLanguage
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      setApiResponse(data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Language-specific error messages
      const detectedLanguage = detectLanguage(query);
      const errorMessage = detectedLanguage === 'hindi'
        ? "खुशी, हम इस समय आपके अनुरोध को संसाधित नहीं कर सके। कृपया बाद में पुनः प्रयास करें।"
        : "Sorry, we couldn't process your request at this time. Please try again later.";
      
      setApiResponse({
        error: true,
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const getColorClasses = (color) => {
    const colors = {
      red: 'from-red-500 to-red-600 border-red-200 bg-red-50',
      green: 'from-green-500 to-green-600 border-green-200 bg-green-50',
      blue: 'from-blue-500 to-blue-600 border-blue-200 bg-blue-50',
      yellow: 'from-yellow-500 to-yellow-600 border-yellow-200 bg-yellow-50',
      purple: 'from-purple-500 to-purple-600 border-purple-200 bg-purple-50',
      orange: 'from-orange-500 to-orange-600 border-orange-200 bg-orange-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 min-h-screen">
      {/* Header */}
      <div className="w-full h-2 flex">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div> 
        <div className="w-1/3 bg-[#138808]"></div> 
      </div>
      
              <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 max-w-6xl">
        {/* Title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl mb-3 sm:mb-0 sm:mr-4 shadow-lg">
              👴
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                <span className="text-[#FF9933]">Elderly</span>{' '}
                <span className="text-[#138808]">Care</span>
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">(वरिष्ठ नागरिक देखभाल - Senior Citizen Care)</p>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
            >
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"
            >
              <p className="text-green-700">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-6 sm:mb-8 bg-white rounded-lg shadow-md p-1 sm:p-2">
          {[
            { id: 'services', label: 'Care Services', icon: '🏥' },
            { id: 'schemes', label: 'Government Schemes', icon: '💰' },
            { id: 'query', label: 'Ask Questions', icon: '❓' },
            { id: 'resources', label: 'Resources', icon: '📚' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-2 sm:px-4 py-2 m-1 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1 sm:mr-2">{tab.icon}</span>
              <span className="font-medium hidden sm:inline">{tab.label}</span>
              <span className="font-medium sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Care Services Tab */}
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
                  🏥 Comprehensive Elderly Care Services
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {elderlyServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleServiceClick(service)}
                      className={`p-4 sm:p-6 rounded-xl border-2 ${getColorClasses(service.color)} hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                    >
                      <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-center">
                        {service.icon}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 text-center">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
                        {service.description}
                      </p>
                      <div className="text-center">
                        <span className="text-xs bg-white px-2 sm:px-3 py-1 rounded-full border">
                          Tap for details
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Government Schemes Tab */}
          {activeTab === 'schemes' && (
            <motion.div
              key="schemes"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideIn}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                💰 Government Schemes for Senior Citizens
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {governmentSchemes.map((scheme, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start mb-3 sm:mb-4">
                      <div className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">{scheme.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-lg text-gray-800 mb-2 leading-tight">
                          {scheme.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                          {scheme.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">Benefit:</span>
                        <span className="text-green-600 font-semibold">{scheme.benefit}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">Eligibility:</span>
                        <span className="text-blue-600">{scheme.eligibility}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <a
                        href={scheme.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold text-xs sm:text-sm flex items-center justify-center group"
                      >
                        <span className="mr-2">🌐</span>
                        Apply on {scheme.websiteName}
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Query Tab */}
          {activeTab === 'query' && (
            <motion.div
              key="query"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideIn}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                ❓ Ask About Senior Citizen Services
              </h2>
              
              <div className="max-w-4xl mx-auto">
                {/* Voice Input Status */}
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center"
                  >
                    <div className="flex items-center text-orange-700">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-sm font-medium">🎤 Listening... Speak your question</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {/* Input with Voice Integration */}
                  <div className="relative">
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                      placeholder="What benefits are available for senior citizens? / 70 वर्ष से अधिक उम्र के वरिष्ठ नागरिकों के लिए क्या लाभ उपलब्ध हैं?"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 rounded-lg border transition-all duration-300 text-sm sm:text-base ${
                        isListening 
                          ? 'border-orange-500 bg-orange-50 focus:ring-2 focus:ring-orange-500' 
                          : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500'
                      }`}
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Voice Controls */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <motion.button
                      onClick={isListening ? handleVoiceStop : handleVoiceStart}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        isListening
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      <span className="mr-2">{isListening ? '🛑' : '🎤'}</span>
                      {isListening ? 'Stop Voice' : 'Start Voice'}
                    </motion.button>

                    {(query || transcript) && (
                      <motion.button
                        onClick={handleVoiceClear}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-3 sm:px-4 py-2 rounded-lg font-medium text-sm bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300"
                      >
                        <span className="mr-2">🗑️</span>
                        Clear
                      </motion.button>
                    )}

                    <motion.button 
                      onClick={handleQuerySubmit}
                      disabled={isLoading || !query.trim()}
                      whileHover={{ scale: isLoading ? 1 : 1.05 }}
                      whileTap={{ scale: isLoading ? 1 : 0.95 }}
                      className={`flex-1 sm:flex-initial bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm font-medium ${isLoading || !query.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🔍</span>
                          Get Information
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Language Detection Indicator */}
                  {query && (
                    <div className="mb-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        detectLanguage(query) === 'hindi' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {detectLanguage(query) === 'hindi' ? '🇮🇳 हिंदी में प्रश्न' : '🇺🇸 English Question'}
                        {' → '}
                        {detectLanguage(query) === 'hindi' ? 'हिंदी में उत्तर मिलेगा' : 'Response in English'}
                      </span>
                    </div>
                  )}

                  {/* Voice Instructions */}
                  <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <span className="mr-2 flex-shrink-0">💡</span>
                      <div>
                        <p className="font-medium mb-1">Voice Input Instructions / आवाज़ निर्देश:</p>
                        <ul className="space-y-1 text-gray-500">
                          <li>• Click &quot;Start Voice&quot; and speak clearly / &quot;Start Voice&quot; दबाएं और साफ बोलें</li>
                          <li>• Supports Hindi (हिंदी) and English / हिंदी और अंग्रेजी समर्थित</li>
                          <li>• Auto-stops after 3 seconds silence / 3 सेकंड चुप्पी के बाद अपने आप रुक जाएगा</li>
                          <li>• Edit text after voice input / आवाज़ के बाद टेक्स्ट को संपादित करें</li>
                          <li>• Response will match your language / उत्तर आपकी भाषा में मिलेगा</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {apiResponse && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 p-4 sm:p-6 rounded-lg border-l-4 border-green-500"
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm sm:text-lg mr-3 sm:mr-4 flex-shrink-0">
                          🤖
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg mb-2 text-green-700">AI Assistant Response</h4>
                          
                          {apiResponse.error ? (
                            <p className="text-red-500">{apiResponse.message}</p>
                          ) : (
                            <div 
                              className="prose prose-lg max-w-none text-gray-700"
                              dangerouslySetInnerHTML={{ __html: apiResponse }}
                            />
                          )}
                          
                          <p className="mt-6 text-xs text-gray-500 pt-4 border-t border-gray-200">
                            Information provided by AI assistance. For official details, please visit government websites or contact relevant departments.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideIn}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                📚 Helpful Resources for Senior Citizens
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center">📞</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-center">Emergency Helplines</h3>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li><strong>National Emergency:</strong> 112</li>
                    <li><strong>Medical Emergency:</strong> 108</li>
                    <li><strong>Women Helpline:</strong> 1091</li>
                    <li><strong>Senior Citizen Helpline:</strong> 1800-180-1551</li>
                    <li><strong>Mental Health:</strong> 1800-599-0019</li>
                    <li><strong>Legal Aid:</strong> 15100</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center">🏥</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-center">Health Resources</h3>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li>• Regular health checkup guidelines</li>
                    <li>• Medication management tips</li>
                    <li>• Exercise programs for seniors</li>
                    <li>• Nutrition guidelines</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center">⚖️</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-center">Legal Rights</h3>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li>• Maintenance and Welfare Act</li>
                    <li>• Property rights protection</li>
                    <li>• Elder abuse prevention</li>
                    <li>• Legal aid services</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center">💡</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-center">Safety Tips</h3>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li>• Home safety modifications</li>
                    <li>• Fall prevention measures</li>
                    <li>• Fraud protection tips</li>
                    <li>• Emergency preparedness</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center">🎯</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-center">Activity Programs</h3>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li>• Senior citizen clubs</li>
                    <li>• Yoga and meditation classes</li>
                    <li>• Hobby and craft groups</li>
                    <li>• Educational programs</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center">🌐</div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-center">Government Websites</h3>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li>• <a href="https://nsap.nic.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pension Portal (nsap.nic.in)</a></li>
                    <li>• <a href="https://socialjustice.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ministry of Social Justice</a></li>
                    <li>• <a href="https://www.pmjay.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ayushman Bharat</a></li>
                    <li>• <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Portal</a></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Service Detail Modal */}
        <AnimatePresence>
          {showServiceModal && selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
              onClick={() => setShowServiceModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{selectedService.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {selectedService.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {selectedService.description}
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800">Available Services:</h4>
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <span className="text-green-500 mr-2 sm:mr-3 flex-shrink-0">✓</span>
                        <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                  <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-blue-800">Contact Information:</h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <span className="font-medium text-blue-700 mr-2">📞 Helpline:</span>
                      <span className="text-blue-600">{selectedService.contactInfo.helpline}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-blue-700 mr-2">📧 Email:</span>
                      <span className="text-blue-600">{selectedService.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-blue-700 mr-2 flex-shrink-0">🌐 Website:</span>
                      <a 
                        href={selectedService.contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {selectedService.contactInfo.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => window.location.href = `tel:${selectedService.contactInfo.helpline}`}
                    className="flex-1 bg-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold text-sm sm:text-base"
                  >
                    📞 Call Now
                  </button>
                  <button
                    onClick={() => setShowServiceModal(false)}
                    className="flex-1 bg-gray-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <div className="w-full h-2 flex">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div> 
        <div className="w-1/3 bg-[#138808]"></div> 
      </div>
    </div>
  );
}