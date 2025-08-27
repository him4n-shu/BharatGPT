'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KisanBot() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // State for the query and response
  const [query, setQuery] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'bot',
      content: 'नमस्ते किसान भाई! मैं आपकी क्या मदद कर सकता हूँ? (Hello farmer! How can I help you today?)',
      time: '10:34 AM'
    }
  ]);

  // Function to handle query submission
  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch('/api/ask-scheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          context: 'agriculture' 
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      const botMessage = {
        role: 'bot',
        content: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setApiResponse(data.response);
      setQuery("");
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
      
      <div className="container mx-auto py-12 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          <span className="text-[#FF9933]">Kisan</span> <span className="text-[#138808]">Bot</span> <span className="text-sm text-gray-500">(किसान बॉट)</span>
        </motion.h1>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto border-t border-[#FF9933]"
        >
          <div className="flex justify-center mb-6 relative">
            <div className="w-20 h-20 bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full flex items-center justify-center text-white text-4xl animate-pulse-slow">
              🌾
            </div>
            <div className="absolute top-0 w-20 h-20 rounded-full border-2 border-dashed border-blue-900 opacity-20 animate-spin-slow"></div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg mb-8 text-center"
          >
            Kisan Bot is your AI-powered virtual assistant for farmers, providing guidance on agricultural practices, weather forecasts, crop management, and government schemes in your local language.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="border border-l-4 border-l-[#FF9933] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#FFF7ED] p-6 rounded-lg shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="text-3xl mb-4 text-[#FF9933]">🌧️</div>
              <h2 className="text-xl font-semibold mb-4 text-[#FF9933]">Weather Forecasts & Alerts</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2">✓</span> 
                  <p>Hyperlocal 7-day weather forecasts (स्थानीय 7-दिवसीय मौसम पूर्वानुमान)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2">✓</span> 
                  <p>Extreme weather alerts (चरम मौसम अलर्ट)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2">✓</span> 
                  <p>Monsoon tracking (मानसून ट्रैकिंग)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2">✓</span> 
                  <p>Irrigation scheduling advice (सिंचाई अनुसूची सलाह)</p>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="border border-l-4 border-l-[#138808] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#F0F9F1] p-6 rounded-lg shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="text-3xl mb-4 text-[#138808]">🌱</div>
              <h2 className="text-xl font-semibold mb-4 text-[#138808]">Crop Management</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2">✓</span> 
                  <p>Crop-specific guidance (फसल-विशिष्ट मार्गदर्शन)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2">✓</span> 
                  <p>Pest & disease identification (कीट और रोग पहचान)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2">✓</span> 
                  <p>Soil health recommendations (मिट्टी स्वास्थ्य अनुशंसाएँ)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2">✓</span> 
                  <p>Harvesting time optimization (कटाई समय अनुकूलन)</p>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="relative bg-gradient-to-r from-[#FFF7ED] via-white to-[#F0F9F1] p-6 rounded-lg mb-10 shadow-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="h-1/3 bg-[#FF9933] opacity-10"></div>
              <div className="h-1/3 bg-white opacity-10"></div>
              <div className="h-1/3 bg-[#138808] opacity-10"></div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Government Schemes for Farmers (किसानों के लिए सरकारी योजनाएं)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex flex-col border-b md:border-b-0 md:border-r border-gray-200 pr-0 md:pr-6 pb-6 md:pb-0"
                whileHover={{ x: 5 }}
              >
                <h3 className="font-medium flex items-center text-[#FF9933]">
                  <span className="w-8 h-8 bg-gradient-to-br from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white mr-2 text-sm shadow-sm">₹</span>
                  PM-KISAN
                </h3>
                <p className="text-sm mt-2">₹6,000 per year direct income support to farmers</p>
                <a href="#" className="text-blue-600 text-sm mt-1 hover:underline">Check eligibility</a>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                whileHover={{ x: 5 }}
              >
                <h3 className="font-medium flex items-center text-[#138808]">
                  <span className="w-8 h-8 bg-gradient-to-br from-[#138808] to-[#4CAF50] rounded-full flex items-center justify-center text-white mr-2 text-sm shadow-sm">🛡️</span>
                  PM Fasal Bima Yojana
                </h3>
                <p className="text-sm mt-2">Crop insurance to protect against natural disasters</p>
                <a href="#" className="text-blue-600 text-sm mt-1 hover:underline">Apply now</a>
              </motion.div>
            </div>
          </motion.div>

          <div className="bg-[#f9f9f9] p-6 rounded-lg mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2">
              <div className="w-24 h-24 rounded-full bg-[#FF9933] opacity-5"></div>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="text-xl font-semibold mb-4 text-[#138808]"
            >
              Try Kisan Bot Now (अभी किसान बॉट आज़माएं)
            </motion.h2>
            
            <div className="mb-5 border border-gray-200 rounded-lg bg-white p-4 shadow-sm h-96 overflow-y-auto">
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
                      <div className="flex items-start max-w-3/4">
                        <div className="w-10 h-10 rounded-full bg-[#138808] flex items-center justify-center text-white mr-3 text-xl flex-shrink-0">
                          🤖
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="text-[#138808] font-medium">Kisan Bot</p>
                            <span className="text-xs text-gray-500 ml-2">{message.time}</span>
                          </div>
                          {message.isError ? (
                            <p className="bg-red-50 p-3 rounded-lg text-red-600 mt-1">
                              {message.content}
                            </p>
                          ) : (
                            <div 
                              className="bg-[#F0F9F1] p-3 rounded-lg mt-1 text-gray-800"
                              dangerouslySetInnerHTML={{ __html: message.content }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {message.role === 'user' && (
                      <div className="flex items-start max-w-3/4">
                        <div>
                          <div className="flex items-center justify-end">
                            <span className="text-xs text-gray-500 mr-2">{message.time}</span>
                            <p className="text-[#FF9933] font-medium">You</p>
                          </div>
                          <p className="bg-[#FFF7ED] p-3 rounded-lg mt-1 text-right">
                            {message.content}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#FF9933] flex items-center justify-center text-white ml-3 text-xl flex-shrink-0">
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
                    <div className="flex items-start max-w-3/4">
                      <div className="w-10 h-10 rounded-full bg-[#138808] flex items-center justify-center text-white mr-3 text-xl flex-shrink-0">
                        🤖
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="text-[#138808] font-medium">Kisan Bot</p>
                          <span className="text-xs text-gray-500 ml-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="bg-[#F0F9F1] p-4 rounded-lg mt-1 flex items-center space-x-2">
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

            <div className="flex">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="अपना प्रश्न पूछें... (Ask your question...)" 
                className="border border-gray-300 p-3 rounded-l-lg flex-grow focus:ring-2 focus:ring-[#138808] focus:border-transparent transition-all duration-300"
              />
              <motion.button 
                onClick={handleQuerySubmit}
                disabled={isLoading || !query.trim()}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className={`bg-gradient-to-r from-[#138808] to-[#2E7D32] text-white px-4 py-3 rounded-r-lg transition-all duration-300 flex items-center justify-center ${isLoading || !query.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </motion.button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Try asking: &quot;कपास की फसल में लाल सुंडी का क्या इलाज है?&quot; (What is the treatment for pink bollworm in cotton?)</p>
            </div>
          </div>

          <div className="gap-6 mb-8 text-center justify-center items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="bg-white border border-[#FF9933] border-opacity-20 p-5 rounded-lg shadow-sm"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-lg font-semibold mb-2 text-[#FF9933]">Local Language Support</h3>
              <p className="text-sm mb-3">Kisan Bot speaks 10+ Indian languages including:</p>
              <div className="flex flex-wrap gap-2 text-center justify-center items-center">
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
            className="border-t border-gray-200 pt-6 text-center"
          >
            <p className="mb-4 text-gray-600">Join 50+ lakh farmers already using Kisan Bot across India</p>
            <div className="flex justify-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#FF9933]"></div>
              <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="w-full h-2 flex mt-12">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div> 
      </div>
    </div>
  );
} 