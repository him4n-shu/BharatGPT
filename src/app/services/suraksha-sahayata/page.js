'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function SurakshaSahayata() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
          <span className="text-[#FF9933]">Suraksha</span> <span className="text-[#138808]">Sahayata</span> <span className="text-sm text-gray-500">(सुरक्षा सहायता)</span>
        </motion.h1>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto border-t border-[#FF9933]"
        >
          <div className="flex justify-center mb-6 relative">
            <div className="w-20 h-20 bg-gradient-to-r from-[#FF9933] to-[#ff5252] rounded-full flex items-center justify-center text-white text-4xl animate-pulse-slow">
              🚨
            </div>
            <div className="absolute top-0 w-20 h-20 rounded-full border-2 border-dashed border-blue-900 opacity-20 animate-spin-slow"></div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg mb-8 text-center"
          >
            Suraksha Sahayata provides quick access to emergency services and important contact information based on your location.
          </motion.p>
        
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-[#FFF5F5] p-6 rounded-lg mb-8 border-l-4 border-[#ff5252]"
          >
            <h2 className="text-2xl font-semibold mb-6 text-[#ff5252]">Emergency Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">👮</div>
                <div>
                  <h3 className="font-medium text-gray-600">Police (पुलिस)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">112</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">🚑</div>
                <div>
                  <h3 className="font-medium text-gray-600">Ambulance (एम्बुलेंस)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">108</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">🔥</div>
                <div>
                  <h3 className="font-medium text-gray-600">Fire (अग्निशमन)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">101</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">👩‍⚕️</div>
                <div>
                  <h3 className="font-medium text-gray-600">Women Helpline (महिला हेल्पलाइन)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">1090</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">🆘</div>
                <div>
                  <h3 className="font-medium text-gray-600">National Emergency (राष्ट्रीय आपातकाल)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">112</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">👶</div>
                <div>
                  <h3 className="font-medium text-gray-600">Child Helpline (चाइल्ड हेल्पलाइन)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">1098</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">🚨</div>
                <div>
                  <h3 className="font-medium text-gray-600">Anti-Poison (विष निरोधक)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">1066</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">🏥</div>
                <div>
                  <h3 className="font-medium text-gray-600">Blood Bank (ब्लड बैंक)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">104</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">🚔</div>
                <div>
                  <h3 className="font-medium text-gray-600">Traffic Police (यातायात पुलिस)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">1073</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border border-[#ff5252] rounded-lg p-5 flex items-center bg-white"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#ff5252] to-[#ff8a80] rounded-full flex items-center justify-center text-3xl mr-4 shadow-sm">⚡</div>
                <div>
                  <h3 className="font-medium text-gray-600">Disaster Management (आपदा प्रबंधन)</h3>
                  <p className="text-2xl font-bold text-[#ff5252]">1078</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Nearby Emergency Services</h2>
            
            <div className="mb-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#138808] to-[#0d6429] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 mb-4 w-full md:w-auto"
                >
                  Share My Location (मेरा स्थान साझा करें)
                </motion.button>
                <p className="text-sm text-gray-500">Share your location to see emergency services near you</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-[#FFF5F5] p-6 rounded-lg border border-[#ff5252] border-opacity-30 shadow-inner"
          >
            <div className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="h-1/3 bg-[#FF9933] opacity-5"></div>
                <div className="h-1/3 bg-white opacity-5"></div>
                <div className="h-1/3 bg-[#138808] opacity-5"></div>
              </div>
              
              <h3 className="font-semibold text-xl mb-3 text-[#ff5252]">Emergency Alert</h3>
              <p className="mb-6 text-gray-700">In case of emergency, send your location to emergency contacts with a single tap.</p>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(229, 57, 53, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-[#ff5252] to-[#d32f2f] text-white py-3 px-6 rounded-lg font-medium hover:from-[#d32f2f] hover:to-[#b71c1c] transition-all duration-300 shadow-md"
              >
                Send Emergency Alert (आपातकालीन अलर्ट भेजें)
              </motion.button>
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