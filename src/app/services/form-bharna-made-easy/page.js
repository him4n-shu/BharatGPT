'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useVoiceInput from '@/hooks/useVoiceInput';

export default function FormBharnaMadeEasy() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // State for the query and response
  const [query, setQuery] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualLanguage, setManualLanguage] = useState('auto');
  
  // Voice input hook
  const {
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
    toggleListening
  } = useVoiceInput({
    language: 'hi-IN',
    silenceTimeout: 3000
  });

  // Update query from transcript
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  // Language detection function
  const detectLanguage = (text) => {
    if (!text || text.trim().length === 0) return 'english';
    
    const cleanText = text.toLowerCase().trim();
    
    // Check for Devanagari script (Hindi)
    const devanagariPattern = /[\u0900-\u097F]/;
    if (devanagariPattern.test(text)) {
      return 'hindi';
    }
    
    // Hindi keywords (Romanized)
    const hindiKeywords = [
      'kya', 'kaise', 'kahan', 'kyun', 'kaun', 'kab', 'kitna', 'kitne',
      'form', 'bharana', 'bharane', 'bharna', 'bharne', 'pasport', 'passport',
      'ration', 'card', 'kard', 'aadhaar', 'aadhar', 'documents', 'dastavej',
      'chahiye', 'chaahiye', 'jaruri', 'zaruri', 'lagega', 'lagenge',
      'government', 'sarkar', 'sarkari', 'online', 'offline', 'apply',
      'application', 'avedan', 'naukri', 'job', 'yojana', 'scheme',
      'paisa', 'paise', 'rupaye', 'rupee', 'help', 'madad', 'sahayata',
      'information', 'jaankari', 'jankari', 'pataa', 'pata', 'batao',
      'bataiye', 'samjhao', 'samjhaiye', 'process', 'prakriya', 'tarika'
    ];
    
    // English keywords
    const englishKeywords = [
      'what', 'how', 'where', 'why', 'who', 'when', 'which', 'much', 'many',
      'form', 'fill', 'filling', 'application', 'apply', 'document', 'need',
      'required', 'necessary', 'government', 'official', 'process', 'step',
      'information', 'help', 'assistance', 'explain', 'tell', 'show',
      'passport', 'ration', 'card', 'aadhaar', 'online', 'offline'
    ];
    
    const words = cleanText.split(/\s+/);
    let hindiCount = 0;
    let englishCount = 0;
    
    // Count matches
    words.forEach(word => {
      if (hindiKeywords.includes(word)) {
        hindiCount++;
      }
      if (englishKeywords.includes(word)) {
        englishCount++;
      }
    });
    
    // Check for common English patterns
    const englishPatterns = [
      /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/g,
      /\b(is|are|was|were|am|be|being|been)\b/g,
      /\b(do|does|did|don|doesn|didn)\b/g,
      /\b(will|would|should|could|might|may)\b/g
    ];
    
    let englishPatternMatches = 0;
    englishPatterns.forEach(pattern => {
      const matches = cleanText.match(pattern);
      if (matches) englishPatternMatches += matches.length;
    });
    
    // Decision logic - be more conservative about Hindi detection
    if (hindiCount >= 2 && englishCount === 0) {
      return 'hindi';
    }
    
    if (englishPatternMatches >= 2 || englishCount >= 2) {
      return 'english';
    }
    
    // Default to English if uncertain
    return 'english';
  };

  // Helper functions for voice input
  const handleVoiceComplete = () => {
    if (transcript.trim()) {
      setQuery(transcript);
    }
  };

  const clearInput = () => {
    setQuery('');
    resetTranscript();
  };

  // Function to handle query submission
  const handleQuerySubmit = async () => {
    const queryText = query.trim() || transcript.trim();
    if (!queryText) return;
    
    // Detect language
    const autoDetectedLanguage = detectLanguage(queryText);
    const finalLanguage = manualLanguage === 'auto' ? autoDetectedLanguage : manualLanguage;
    
    // Debug logging only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Query text:', queryText);
      console.log('Auto detected language:', autoDetectedLanguage);
      console.log('Final language:', finalLanguage);
    }
    
    setIsLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch('/api/ask-scheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: queryText,
          context: 'form',
          language: finalLanguage
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      // Debug logging only in development
      if (process.env.NODE_ENV === 'development') {
        console.log('API Response data:', data);
        console.log('Response metadata:', data.metadata);
      }
      setApiResponse(data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      setApiResponse({
        error: true,
        message: "Sorry, we couldn't process your request at this time. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f9f9f9] to-white min-h-screen">
      <div className="w-full h-2 flex">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div> 
        <div className="w-1/3 bg-[#138808]"></div>
      </div>
      
      <div className="container mx-auto py-6 sm:py-12 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center"
        >
          <span className="text-[#FF9933]">Form Bharna</span> <br className="sm:hidden" />
          <span className="text-[#138808]">Made Easy</span> <br className="sm:hidden" />
          <span className="text-xs sm:text-sm text-gray-500 block sm:inline">(फॉर्म भरना आसान)</span>
        </motion.h1>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg max-w-4xl mx-auto border-t border-[#FF9933]"
        >
          <div className="flex flex-col md:flex-row items-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-[#138808] to-[#2E7D32] rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 md:mb-0 md:mr-6 lg:mr-8 animate-pulse-slow">
                📝
              </div>
              <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-dashed border-blue-900 opacity-20 animate-spin-slow"></div>
            </div>
            <div className="text-center md:text-left">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]"
              >
                Understand Every Form Field
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-sm sm:text-base text-gray-700"
              >
                AI explains what each field means in ration cards, passports, and other government forms.
                Never be confused by complicated government paperwork again.
              </motion.p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 sm:pt-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[#138808]">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border border-l-4 border-l-[#FF9933] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#FFF7ED] p-4 sm:p-5 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Simple explanations for every form field in your language</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Voice input support for easy queries</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Tooltips that explain what information is needed for each section</p>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border border-l-4 border-l-[#138808] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#F0F9F1] p-4 sm:p-5 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Examples of how to correctly fill important entries</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Multi-language support (Hindi & English)</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Support for all major government forms and applications</p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-[#f9f9f9] p-4 sm:p-6 rounded-lg mt-8 sm:mt-10 mb-8 sm:mb-10"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">How It Works</h3>
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-[#FF9933] to-[#FFC285] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold mr-3 sm:mr-4 flex-shrink-0 shadow-sm text-sm sm:text-base">1</div>
                <div>
                  <p className="font-semibold text-[#FF9933] mb-1 text-sm sm:text-base">Ask about any form field or use voice input</p>
                  <p className="text-gray-600 text-sm sm:text-base">Type or speak your question about passport, ration card, Aadhaar, and other forms</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-white to-[#E8E8E8] text-[#138808] w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold mr-3 sm:mr-4 flex-shrink-0 shadow-sm border border-gray-200 text-sm sm:text-base">2</div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">Get AI-powered explanations</p>
                  <p className="text-gray-600 text-sm sm:text-base">Receive clear explanations in your preferred language</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-[#138808] to-[#4CAF50] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold mr-3 sm:mr-4 flex-shrink-0 shadow-sm text-sm sm:text-base">3</div>
                <div>
                  <p className="font-semibold text-[#138808] mb-1 text-sm sm:text-base">Fill forms with confidence</p>
                  <p className="text-gray-600 text-sm sm:text-base">Use the guidance to correctly complete your government forms</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">Supported Forms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-gradient-to-r from-[#FF9933] to-[#FFC285] p-3 sm:p-4">
                  <h4 className="text-white font-bold flex items-center text-sm sm:text-base">
                    <span className="mr-2 text-lg sm:text-xl">🛂</span> Passport Application (पासपोर्ट आवेदन)
                  </h4>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-gray-700 mb-3 text-sm sm:text-base">Confused by &quot;Place of Birth&quot; vs &quot;City of Birth&quot;?</p>
                  <div className="bg-[#FFF7ED] p-3 sm:p-4 rounded-md text-xs sm:text-sm border-l-4 border-[#FF9933]">
                    <span className="font-semibold text-[#FF9933]">Our Explanation:</span> Place of Birth means the village, town, or city where you were born. City of Birth asks specifically for the main municipal city name.
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-gradient-to-r from-[#138808] to-[#4CAF50] p-3 sm:p-4">
                  <h4 className="text-white font-bold flex items-center text-sm sm:text-base">
                    <span className="mr-2 text-lg sm:text-xl">🆔</span> Ration Card (राशन कार्ड)
                  </h4>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-gray-700 mb-3 text-sm sm:text-base">What does &quot;Annual Family Income&quot; include?</p>
                  <div className="bg-[#F0F9F1] p-3 sm:p-4 rounded-md text-xs sm:text-sm border-l-4 border-[#138808]">
                    <span className="font-semibold text-[#138808]">Our Explanation:</span> Add all income sources from all family members living together: salary, pensions, farming income, business profits, rent, etc.
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-center"
          >
          </motion.div>

          {/* Ask About Forms Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200"
          >
            <div className="bg-[#f9f9f9] p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 relative overflow-hidden shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Ask About Any Form</h3>
              
              {/* Voice Error Display */}
              <AnimatePresence>
                {voiceError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-600 text-sm">Voice input error: {voiceError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="flex flex-col gap-4">
                  {/* Input Field with Voice Button */}
                  <div className="relative">
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                      placeholder="What documents do I need for a passport application? (पासपोर्ट के लिए कौन से दस्तावेज चाहिए?)"
                      className={`w-full px-4 py-3 pr-20 sm:pr-24 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933] transition-all duration-300 text-sm sm:text-base ${isListening ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                      disabled={isLoading}
                    />
                    
                    {/* Voice Input Button */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <motion.button
                        type="button"
                        onClick={toggleListening}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full transition-all duration-300 touch-manipulation ${
                          isListening 
                            ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                        title={isListening ? 'Stop listening' : 'Start voice input'}
                        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                      >
                        <span className="text-sm sm:text-base">
                          {isListening ? '🔴' : '🎤'}
                        </span>
                      </motion.button>
                      
                      {(query || transcript) && (
                        <motion.button
                          type="button"
                          onClick={clearInput}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 touch-manipulation"
                          title="Clear input"
                          aria-label="Clear input"
                        >
                          <span className="text-sm sm:text-base">✕</span>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Language Detection Display */}
                  <AnimatePresence>
                    {(query || transcript) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded border"
                      >
                        <span className="font-medium">Detected Language:</span> {
                          manualLanguage === 'auto' 
                            ? `${detectLanguage(query || transcript)} (auto)` 
                            : `${manualLanguage} (manual)`
                        }
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Manual Language Toggle */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span className="text-sm text-gray-600 font-medium">Language:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setManualLanguage('english')}
                        className={`px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-200 touch-manipulation ${
                          manualLanguage === 'english'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setManualLanguage('hindi')}
                        className={`px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-200 touch-manipulation ${
                          manualLanguage === 'hindi'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        हिंदी
                      </button>
                      <button
                        onClick={() => setManualLanguage('auto')}
                        className={`px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-200 touch-manipulation ${
                          manualLanguage === 'auto'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    onClick={handleQuerySubmit}
                    disabled={isLoading || !query.trim()}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    className={`bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center w-full sm:w-auto sm:mx-auto sm:block touch-manipulation ${isLoading || !query.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : "Get Information"}
                  </motion.button>
                </div>

                {/* Voice Status */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-blue-500 rounded-full"
                              animate={{
                                height: [8, 16, 8],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-blue-700 font-medium text-sm">Listening... Speak now</span>
                      </div>
                      <p className="text-blue-600 text-xs mt-2 text-center">
                        Try: &quot;पासपोर्ट के लिए कौन से दस्तावेज चाहिए?&quot; or &quot;What documents are needed for passport?&quot;
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Loading Skeleton */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 sm:mt-8 text-left bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-l-[#138808]"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#138808] flex items-center justify-center text-white text-base sm:text-lg mr-3 sm:mr-4 flex-shrink-0">
                        <div className="animate-spin">⚡</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-[#138808]">Generating Response...</h4>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="shimmer h-3 sm:h-4 w-full"></div>
                          <div className="shimmer h-3 sm:h-4 w-4/5"></div>
                          <div className="shimmer h-3 sm:h-4 w-3/4"></div>
                          <div className="shimmer h-3 sm:h-4 w-5/6"></div>
                          <div className="shimmer h-3 sm:h-4 w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {apiResponse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 sm:mt-8 text-left bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-l-[#138808] -ml-8 sm:ml-0 w-screen sm:w-auto -mr-4 sm:mr-0"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#138808] flex items-center justify-center text-white text-base sm:text-lg mr-3 sm:mr-4 flex-shrink-0">
                        🤖
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-[#138808]">Form Information</h4>
                        
                        {apiResponse.error ? (
                          <p className="text-red-500 text-sm sm:text-base">{apiResponse.message}</p>
                        ) : (
                          <div 
                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 scheme-response overflow-visible"
                            style={{ 
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              maxHeight: 'none',
                              lineHeight: '1.6',
                              fontSize: 'inherit'
                            }}
                            dangerouslySetInnerHTML={{ __html: apiResponse }}
                          />
                        )}
                        
                        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t border-gray-200">
                          Information provided by AI assistance. For official details, please visit the official government websites.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    
      <div className="w-full h-2 flex mt-8 sm:mt-12">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div> 
        <div className="w-1/3 bg-[#138808]"></div> 
      </div>
    </div>
  );
} 