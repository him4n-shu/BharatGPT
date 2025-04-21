'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FormBharnaMadeEasy() {
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
          context: 'form' 
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
          <span className="text-[#FF9933]">Form Bharna</span> <span className="text-[#138808]">Made Easy</span> <span className="text-sm text-gray-500">(फॉर्म भरना आसान)</span>
        </motion.h1>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto border-t border-[#FF9933]"
        >
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-[#138808] to-[#2E7D32] rounded-full flex items-center justify-center text-white text-5xl mb-6 md:mb-0 md:mr-8 animate-pulse-slow">
                📝
              </div>
              <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-2 border-dashed border-blue-900 opacity-20 animate-spin-slow"></div>
            </div>
            <div>
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]"
              >
                Understand Every Form Field
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-gray-700"
              >
                AI explains what each field means in ration cards, passports, and other government forms.
                Never be confused by complicated government paperwork again.
              </motion.p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold mb-4 text-[#138808]">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border border-l-4 border-l-[#FF9933] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#FFF7ED] p-5 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2">✓</span>
                    <p>Simple explanations for every form field in your language</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2">✓</span>
                    <p>Tooltips that explain what information is needed for each section</p>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border border-l-4 border-l-[#138808] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#F0F9F1] p-5 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2">✓</span>
                    <p>Examples of how to correctly fill important entries</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2">✓</span>
                    <p>Support for all major government forms and applications</p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-[#f9f9f9] p-6 rounded-lg mt-10 mb-10"
          >
            <h3 className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">How It Works</h3>
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-[#FF9933] to-[#FFC285] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-sm">1</div>
                <div>
                  <p className="font-semibold text-[#FF9933] mb-1">Select a form type</p>
                  <p className="text-gray-600">Choose from passport, ration card, Aadhaar, and other common forms</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-white to-[#E8E8E8] text-[#138808] w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-sm border border-gray-200">2</div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">View the interactive form</p>
                  <p className="text-gray-600">See the form with hover tooltips on each field</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-[#138808] to-[#4CAF50] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-sm">3</div>
                <div>
                  <p className="font-semibold text-[#138808] mb-1">Get clear explanations</p>
                  <p className="text-gray-600">Hover over or click on any field to understand what information is needed</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-center">Supported Forms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-gradient-to-r from-[#FF9933] to-[#FFC285] p-4">
                  <h4 className="text-white font-bold flex items-center">
                    <span className="mr-2">🛂</span> Passport Application (पासपोर्ट आवेदन)
                  </h4>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 mb-3">Confused by &quot;Place of Birth&quot; vs &quot;City of Birth&quot;?</p>
                  <div className="bg-[#FFF7ED] p-4 rounded-md text-sm border-l-4 border-[#FF9933]">
                    <span className="font-semibold text-[#FF9933]">Our Explanation:</span> Place of Birth means the village, town, or city where you were born. City of Birth asks specifically for the main municipal city name.
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-gradient-to-r from-[#138808] to-[#4CAF50] p-4">
                  <h4 className="text-white font-bold flex items-center">
                    <span className="mr-2">🆔</span> Ration Card (राशन कार्ड)
                  </h4>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 mb-3">What does &quot;Annual Family Income&quot; include?</p>
                  <div className="bg-[#F0F9F1] p-4 rounded-md text-sm border-l-4 border-[#138808]">
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
            className="mt-10 pt-8 border-t border-gray-200"
          >
            <div className="bg-[#f9f9f9] p-6 rounded-lg mb-8 relative overflow-hidden shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Ask About Any Form</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What documents do I need for a passport application? (पासपोर्ट के लिए कौन से दस्तावेज चाहिए?)"
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
                        <h4 className="font-semibold text-lg mb-2 text-[#138808]">Form Information</h4>
                        
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