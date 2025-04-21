'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ElderlyCare() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // State for the query and response
  const [query, setQuery] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle query submission
  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    
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
          context: 'elderly' 
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
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
      
      <div className="container mx-auto py-12 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          <span className="text-[#FF9933]">Elderly</span> <span className="text-[#138808]">Care</span> <span className="text-sm text-gray-500">(वरिष्ठ नागरिक देखभाल)</span>
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
              👴
            </div>
            <div className="absolute top-0 w-20 h-20 rounded-full border-2 border-dashed border-blue-900 opacity-20 animate-spin-slow"></div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg mb-8 text-center"
          >
            Our Elderly Care service provides comprehensive support and assistance to senior citizens, ensuring their well-being, health, and dignity through dedicated resources and community care programs.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="border border-l-4 border-l-[#FF9933] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#FFF7ED] p-6 rounded-lg shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="text-3xl mb-4 text-[#FF9933]">🏥</div>
              <h2 className="text-xl font-semibold mb-2 text-[#FF9933]">Healthcare Support</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2">✓</span> 
                  <p>Home healthcare services (घर पर स्वास्थ्य सेवाएं)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2">✓</span> 
                  <p>Medicine delivery (दवा की होम डिलीवरी)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2">✓</span> 
                  <p>Regular health checkups (नियमित स्वास्थ्य जांच)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF9933] mr-2">✓</span> 
                  <p>Emergency medical assistance (आपातकालीन चिकित्सा सहायता)</p>
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
              <div className="text-3xl mb-4 text-[#138808]">🧓</div>
              <h2 className="text-xl font-semibold mb-2 text-[#138808]">Daily Living Assistance</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2">✓</span> 
                  <p>Meal preparation and delivery (भोजन तैयारी और डिलीवरी)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2">✓</span> 
                  <p>Grocery and essentials shopping (किराना और जरूरी सामान की खरीदारी)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2">✓</span> 
                  <p>Assistance with personal care (व्यक्तिगत देखभाल में सहायता)</p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138808] mr-2">✓</span> 
                  <p>Mobility support (चलने-फिरने में सहायता)</p>
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
            
            <h2 className="text-xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Government Schemes for Elderly (वरिष्ठ नागरिकों के लिए सरकारी योजनाएं)</h2>
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex items-center border-b pb-3"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white mr-4 shadow-sm">
                  💰
                </div>
                <div>
                  <h3 className="font-medium">Indira Gandhi National Old Age Pension Scheme (IGNOAPS)</h3>
                  <p className="text-sm text-gray-600">Monthly pension of ₹200-₹500 for seniors below poverty line</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="flex items-center border-b pb-3"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFFFFF] to-[#E8E8E8] rounded-full flex items-center justify-center text-white mr-4 shadow-sm border border-gray-200">
                  🏠
                </div>
                <div>
                  <h3 className="font-medium">Rashtriya Vayoshri Yojana (राष्ट्रीय वयोश्री योजना)</h3>
                  <p className="text-sm text-gray-600">Free physical aids and assisted living devices for seniors</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="flex items-center border-b pb-3"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#138808] to-[#4CAF50] rounded-full flex items-center justify-center text-white mr-4 shadow-sm">
                  ⚕️
                </div>
                <div>
                  <h3 className="font-medium">Pradhan Mantri Vaya Vandana Yojana (PMVVY)</h3>
                  <p className="text-sm text-gray-600">Pension scheme offering 8% assured return for 10 years for senior citizens</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 }}
                className="flex items-center"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#0D47A1] to-[#1976D2] rounded-full flex items-center justify-center text-white mr-4 shadow-sm">
                  🏥
                </div>
                <div>
                  <h3 className="font-medium">Ayushman Bharat for Senior Citizens (आयुष्मान भारत)</h3>
                  <p className="text-sm text-gray-600">Health coverage up to ₹5 lakhs per family annually</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-10 pt-8 border-t border-gray-200"
          >
            <div className="bg-[#f9f9f9] p-6 rounded-lg mb-8 relative overflow-hidden shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Ask About Senior Schemes</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What benefits are available for senior citizens over 70? (70 वर्ष से अधिक उम्र के वरिष्ठ नागरिकों के लिए क्या लाभ उपलब्ध हैं?)"
                  className="w-full md:w-96 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933] transition-all duration-300"
                />
                <motion.button 
                  onClick={handleQuerySubmit}
                  disabled={isLoading || !query.trim()}
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  className={`bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap flex items-center ${isLoading || !query.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              
              <AnimatePresence>
                {apiResponse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 text-left bg-white p-6 rounded-lg shadow-md border-l-4 border-l-[#138808]"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-[#138808] flex items-center justify-center text-white text-lg mr-4 flex-shrink-0">
                        🤖
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2 text-[#138808]">Senior Citizen Information</h4>
                        
                        {apiResponse.error ? (
                          <p className="text-red-500">{apiResponse.message}</p>
                        ) : (
                          <div 
                            className="prose prose-lg max-w-none text-gray-700 scheme-response"
                            dangerouslySetInnerHTML={{ __html: apiResponse }}
                          />
                        )}
                        
                        <p className="mt-6 text-xs text-gray-500 pt-4 border-t border-gray-200">
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
      
      <div className="w-full h-2 flex mt-12">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div> 
        <div className="w-1/3 bg-[#138808]"></div> 
      </div>
    </div>
  );
} 