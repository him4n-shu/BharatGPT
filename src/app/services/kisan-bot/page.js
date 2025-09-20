'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useVoiceInput from '@/hooks/useVoiceInput';

export default function KisanBot() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // State for the query and response
  const [query, setQuery] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualLanguage, setManualLanguage] = useState('auto');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'bot',
      content: 'नमस्ते किसान भाई! मैं आपकी क्या मदद कर सकता हूँ? (Hello farmer! How can I help you today?)',
      time: '10:34 AM'
    }
  ]);
  
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

  // Language detection function optimized for agriculture terms
  const detectLanguage = (text) => {
    if (!text || text.trim().length === 0) return 'english';
    
    const cleanText = text.toLowerCase().trim();
    
    // Check for Devanagari script (Hindi)
    const devanagariPattern = /[\u0900-\u097F]/;
    if (devanagariPattern.test(text)) {
      return 'hindi';
    }
    
    // Hindi keywords (Agriculture-focused)
    const hindiKeywords = [
      'kya', 'kaise', 'kahan', 'kyun', 'kaun', 'kab', 'kitna', 'kitne',
      'fasal', 'khet', 'kheti', 'kisan', 'किसान', 'फसल', 'खेत', 'खेती',
      'bija', 'beej', 'बीज', 'paani', 'pani', 'पानी', 'सिंचाई', 'sinchai',
      'khad', 'खाद', 'dawai', 'दवाई', 'keet', 'कीट', 'rog', 'रोग',
      'mausam', 'मौसम', 'barish', 'बारिश', 'dhoop', 'धूप', 'sooraj', 'सूरज',
      'jameen', 'जमीन', 'mitti', 'मिट्टी', 'upaj', 'उपज', 'katai', 'कटाई',
      'yojana', 'योजना', 'sarkar', 'सरकार', 'sahayata', 'सहायता',
      'karz', 'कर्ज', 'loan', 'subsidy', 'सब्सिडी', 'madad', 'मदद',
      'batao', 'bataiye', 'बताओ', 'बताइए', 'samjhao', 'समझाओ',
      'kapas', 'कपास', 'gehu', 'गेहूं', 'chawal', 'चावल', 'makka', 'मक्का'
    ];
    
    // English keywords (Agriculture-focused)
    const englishKeywords = [
      'what', 'how', 'where', 'why', 'who', 'when', 'which', 'much', 'many',
      'crop', 'farm', 'farming', 'farmer', 'agriculture', 'field', 'cultivation',
      'seed', 'water', 'irrigation', 'fertilizer', 'pesticide', 'insect', 'pest',
      'disease', 'weather', 'rain', 'sun', 'soil', 'harvest', 'yield',
      'government', 'scheme', 'subsidy', 'loan', 'help', 'assistance',
      'cotton', 'wheat', 'rice', 'corn', 'maize', 'sugarcane', 'soybean',
      'tell', 'explain', 'show', 'guide', 'treatment', 'control', 'management'
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
    
    console.log('Query text:', queryText);
    console.log('Auto detected language:', autoDetectedLanguage);
    console.log('Final language:', finalLanguage);
    
    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setApiResponse(null);
    setQuery("");
    resetTranscript();
    
    try {
      const response = await fetch('/api/ask-scheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: queryText,
          context: 'agriculture',
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
      
      // Add bot response to chat
      const botMessage = {
        role: 'bot',
        content: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setApiResponse(data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Add error message to chat
      const errorMessage = {
        role: 'bot',
        content: "माफ़ करें, मैं आपके प्रश्न का उत्तर नहीं दे पा रहा हूँ। कृपया बाद में पुनः प्रयास करें। (Sorry, I couldn't process your request. Please try again later.)",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
      setApiResponse({
        error: true,
        message: "Sorry, we couldn't process your request at this time. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuerySubmit();
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
          <span className="text-[#FF9933]">Kisan</span> <span className="text-[#138808]">Bot</span> <br className="sm:hidden" />
          <span className="text-xs sm:text-sm text-gray-500 block sm:inline">(किसान बॉट)</span>
        </motion.h1>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg max-w-4xl mx-auto border-t border-[#FF9933]"
        >
          <div className="flex justify-center mb-4 sm:mb-6 relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl animate-pulse-slow">
              🌾
            </div>
            <div className="absolute top-0 w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full border-2 border-dashed border-blue-900 opacity-20 animate-spin-slow"></div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-center leading-relaxed"
          >
            Kisan Bot is your AI-powered virtual assistant for farmers, providing guidance on agricultural practices, weather forecasts, crop management, and government schemes in your local language.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="border border-l-4 border-l-[#FF9933] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#FFF7ED] p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-[#FF9933]">🌧️</div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#FF9933]">Weather Forecasts & Alerts</h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Hyperlocal 7-day weather forecasts (स्थानीय 7-दिवसीय मौसम पूर्वानुमान)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Extreme weather alerts (चरम मौसम अलर्ट)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Monsoon tracking (मानसून ट्रैकिंग)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Voice input support for easy queries</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Irrigation scheduling advice (सिंचाई अनुसूची सलाह)</p>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="border border-l-4 border-l-[#138808] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#F0F9F1] p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-[#138808]">🌱</div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#138808]">Crop Management</h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Crop-specific guidance (फसल-विशिष्ट मार्गदर्शन)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Pest & disease identification (कीट और रोग पहचान)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Multi-language support (Hindi & English)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Soil health recommendations (मिट्टी स्वास्थ्य अनुशंसाएँ)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2 flex-shrink-0">✓</span> 
                  <p className="text-sm sm:text-base">Harvesting time optimization (कटाई समय अनुकूलन)</p>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="relative bg-gradient-to-r from-[#FFF7ED] via-white to-[#F0F9F1] p-4 sm:p-6 rounded-lg mb-8 sm:mb-10 shadow-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20">
              <div className="h-1/3 bg-[#FF9933] opacity-10"></div>
              <div className="h-1/3 bg-white opacity-10"></div>
              <div className="h-1/3 bg-[#138808] opacity-10"></div>
            </div>
            
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Government Schemes for Farmers (किसानों के लिए सरकारी योजनाएं)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex flex-col border-b sm:border-b-0 sm:border-r border-gray-200 pr-0 sm:pr-6 pb-4 sm:pb-0"
                whileHover={{ x: 5 }}
              >
                <h3 className="font-medium flex items-center text-[#FF9933] text-sm sm:text-base">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white mr-2 text-xs sm:text-sm shadow-sm flex-shrink-0">₹</span>
                  PM-KISAN
                </h3>
                <p className="text-xs sm:text-sm mt-2">₹6,000 per year direct income support to farmers</p>
                <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs sm:text-sm mt-1 hover:underline">Check eligibility</a>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                whileHover={{ x: 5 }}
              >
                <h3 className="font-medium flex items-center text-[#138808] text-sm sm:text-base">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#138808] to-[#4CAF50] rounded-full flex items-center justify-center text-white mr-2 text-xs sm:text-sm shadow-sm flex-shrink-0">🛡️</span>
                  PM Fasal Bima Yojana
                </h3>
                <p className="text-xs sm:text-sm mt-2">Crop insurance to protect against natural disasters</p>
                <a href="https://pmfby.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs sm:text-sm mt-1 hover:underline">Apply now</a>
              </motion.div>
            </div>
          </motion.div>

          <div className="bg-[#f9f9f9] p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FF9933] opacity-5"></div>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="text-lg sm:text-xl font-semibold mb-4 text-[#138808]"
            >
              Try Kisan Bot Now (अभी किसान बॉट आज़माएं)
            </motion.h2>
            
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
            
            <div className="mb-4 sm:mb-5 border border-gray-200 rounded-lg bg-white p-3 sm:p-4 shadow-sm h-80 sm:h-96 overflow-y-auto">
              <div className="flex flex-col space-y-4">
                {chatMessages.map((message, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'bot' && (
                      <div className="flex items-start max-w-full sm:max-w-3/4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#138808] flex items-center justify-center text-white mr-2 sm:mr-3 text-lg sm:text-xl flex-shrink-0">
                          🤖
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-[#138808] font-medium text-sm sm:text-base">Kisan Bot</p>
                            <span className="text-xs text-gray-500 ml-2">{message.time}</span>
                          </div>
                          {message.isError ? (
                            <p className="bg-red-50 p-2 sm:p-3 rounded-lg text-red-600 mt-1 text-sm sm:text-base">
                              {message.content}
                            </p>
                          ) : (
                            <div 
                              className="bg-[#F0F9F1] p-2 sm:p-3 rounded-lg mt-1 text-gray-800 text-sm sm:text-base scheme-response"
                              style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                lineHeight: '1.5'
                              }}
                              dangerouslySetInnerHTML={{ __html: message.content }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {message.role === 'user' && (
                      <div className="flex items-start max-w-full sm:max-w-3/4 ml-auto">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-end">
                            <span className="text-xs text-gray-500 mr-2">{message.time}</span>
                            <p className="text-[#FF9933] font-medium text-sm sm:text-base">You</p>
                          </div>
                          <p className="bg-[#FFF7ED] p-2 sm:p-3 rounded-lg mt-1 text-right text-sm sm:text-base break-words">
                            {message.content}
                          </p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF9933] flex items-center justify-center text-white ml-2 sm:ml-3 text-lg sm:text-xl flex-shrink-0">
                          👨‍🌾
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start max-w-full sm:max-w-3/4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#138808] flex items-center justify-center text-white mr-2 sm:mr-3 text-lg sm:text-xl flex-shrink-0">
                        🤖
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-[#138808] font-medium text-sm sm:text-base">Kisan Bot</p>
                          <span className="text-xs text-gray-500 ml-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="bg-[#F0F9F1] p-3 sm:p-4 rounded-lg mt-1 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#138808] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#138808] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-[#138808] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
                  className="mb-4 text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded border"
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
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

            <div className="relative">
              {/* Input Field with Voice Button */}
              <div className="relative mb-4">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="अपना प्रश्न पूछें... (Ask your question...)" 
                  className={`w-full border border-gray-300 p-3 pr-20 sm:pr-24 rounded-lg focus:ring-2 focus:ring-[#138808] focus:border-transparent transition-all duration-300 text-sm sm:text-base ${isListening ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
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

              {/* Submit Button */}
              <motion.button 
                onClick={handleQuerySubmit}
                disabled={isLoading || !query.trim()}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className={`w-full bg-gradient-to-r from-[#138808] to-[#2E7D32] text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center touch-manipulation ${isLoading || !query.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </motion.button>

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
                      Try: &quot;कपास की फसल में कीट लगा है&quot; or &quot;What fertilizer for wheat crop?&quot;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Try asking: &quot;कपास की फसल में लाल सुंडी का क्या इलाज है?&quot; (What is the treatment for pink bollworm in cotton?)</p>
            </div>
          </div>

          <div className="mb-6 sm:mb-8 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="bg-white border border-[#FF9933] border-opacity-20 p-4 sm:p-5 rounded-lg shadow-sm"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-[#FF9933]">Local Language Support</h3>
              <p className="text-xs sm:text-sm mb-3">Kisan Bot speaks 10+ Indian languages including:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-[#FFF7ED] px-2 py-1 rounded text-xs text-[#FF9933]">हिंदी</span>
                <span className="bg-[#FFF7ED] px-2 py-1 rounded text-xs text-[#FF9933]">मराठी</span>
                <span className="bg-[#FFF7ED] px-2 py-1 rounded text-xs text-[#FF9933]">தமிழ்</span>
                <span className="bg-[#FFF7ED] px-2 py-1 rounded text-xs text-[#FF9933]">తెలుగు</span>
                <span className="bg-[#FFF7ED] px-2 py-1 rounded text-xs text-[#FF9933]">ಕನ್ನಡ</span>
                <span className="bg-[#FFF7ED] px-2 py-1 rounded text-xs text-[#FF9933]">+ 5 more</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="border-t border-gray-200 pt-4 sm:pt-6 text-center"
          >
            <p className="mb-4 text-sm sm:text-base text-gray-600">Get instant farming guidance and government scheme information with AI assistance</p>
            <div className="flex justify-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#FF9933]"></div>
              <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
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