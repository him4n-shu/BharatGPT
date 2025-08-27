'use client';
import { motion } from 'framer-motion';

export default function Services() {
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
      
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-center">
            <span className="text-[#FF9933] relative">
              BharatGPT
              <span className="absolute -top-4 right-0 text-xs text-gray-500">®</span>
            </span>{" "}
            <span className="text-[#138808]">Services</span>
          </h1>
          
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Empowering every Indian citizen with AI-powered solutions for everyday government and civic needs.
          </p>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 opacity-5 w-72 h-72">
            <div className="w-full h-full border-[15px] border-[#000080] rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 border-[2px] border-[#000080] rounded-full"></div>
            <div className="absolute inset-0 m-5 border-[2px] border-[#000080] rounded-full"></div>
            <div className="absolute inset-0 m-10 border-[2px] border-[#000080] rounded-full"></div>
            <div className="absolute inset-0 m-15 border-[2px] border-[#000080] rounded-full"></div>
            <div className="absolute inset-0 m-20 border-[2px] border-[#000080] rounded-full"></div>
          </div>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Service 1 - Sarkari Sahayak */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#FF9933]"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF9933] to-[#FFD699] rounded-full flex items-center justify-center text-white text-3xl mb-4 transform transition-transform hover:rotate-12">
                🧾
              </div>
              <h3 className="text-xl font-bold mb-3">Sarkari Sahayak</h3>
              <p className="text-dark-gray mb-6 text-sm">
                Get simplified summaries of govt schemes (PMAY, PM Kisan, etc.) and steps to apply.
              </p>
              <div className="flex justify-between items-center">
                <a href="/services/sarkari-sahayak" className="text-[#FF9933] font-medium hover:underline flex items-center">
                  Try it <span className="ml-1">→</span>
                </a>
                <span className="bg-[#FFE8CC] text-[#FF9933] text-xs px-2 py-1 rounded-full">Popular</span>
              </div>
            </motion.div>
            
            {/* Service 2 - Form Bharna Made Easy */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#138808]"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#138808] to-[#8BC34A] rounded-full flex items-center justify-center text-white text-3xl mb-4 transform transition-transform hover:rotate-12">
                📝
              </div>
              <h3 className="text-xl font-bold mb-3">Form Bharna Made Easy</h3>
              <p className="text-dark-gray mb-6 text-sm">
                AI explains what each field means in ration/passport forms, making complicated forms simple to understand.
              </p>
              <div className="flex justify-between items-center">
                <a href="/services/form-bharna-made-easy" className="text-[#138808] font-medium hover:underline flex items-center">
                  Try it <span className="ml-1">→</span>
                </a>
                <span className="bg-[#E8F5E9] text-[#138808] text-xs px-2 py-1 rounded-full">Time Saver</span>
              </div>
            </motion.div>
            
            {/* Service 3 - Kisan Bot */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#FF9933]"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF9933] to-[#FFD699] rounded-full flex items-center justify-center text-white text-3xl mb-4 transform transition-transform hover:rotate-12">
                🌾
              </div>
              <h3 className="text-xl font-bold mb-3">Kisan Bot</h3>
              <p className="text-dark-gray mb-6 text-sm">
                Weather info, mandi prices, and crop suggestions based on your region to help farmers make better decisions.
              </p>
              <div className="flex justify-between items-center">
                <a href="/services/kisan-bot" className="text-[#FF9933] font-medium hover:underline flex items-center">
                  Try it <span className="ml-1">→</span>
                </a>
                <span className="bg-[#FFE8CC] text-[#FF9933] text-xs px-2 py-1 rounded-full">For Farmers</span>
              </div>
            </motion.div>
            
            {/* Service 4 - Paise Ki Bachat */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#138808]"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#138808] to-[#8BC34A] rounded-full flex items-center justify-center text-white text-3xl mb-4 transform transition-transform hover:rotate-12">
                💰
              </div>
              <h3 className="text-xl font-bold mb-3">Paise Ki Bachat</h3>
              <p className="text-dark-gray mb-6 text-sm">
                Weekly tips for saving money, subsidies, and free resources to help you manage your finances better.
              </p>
              <div className="flex justify-between items-center">
                <a href="/services/paise-ki-bachat" className="text-[#138808] font-medium hover:underline flex items-center">
                  Try it <span className="ml-1">→</span>
                </a>
                <span className="bg-[#E8F5E9] text-[#138808] text-xs px-2 py-1 rounded-full">Money Saver</span>
              </div>
            </motion.div>
            
            {/* Service 5 - Suraksha Sahayata */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#FF9933]"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF9933] to-[#FFD699] rounded-full flex items-center justify-center text-white text-3xl mb-4 transform transition-transform hover:rotate-12">
                🚨
              </div>
              <h3 className="text-xl font-bold mb-3">Suraksha Sahayata</h3>
              <p className="text-dark-gray mb-6 text-sm">
                Emergency numbers for police, fire, ambulance, and local helplines based on your location.
              </p>
              <div className="flex justify-between items-center">
                <a href="/services/suraksha-sahayata" className="text-[#FF9933] font-medium hover:underline flex items-center">
                  Try it <span className="ml-1">→</span>
                </a>
                <span className="bg-[#FFE8CC] text-[#FF9933] text-xs px-2 py-1 rounded-full">Life Saver</span>
              </div>
            </motion.div>
            
            {/* Service 6 - Elderly Care */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#138808]"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#138808] to-[#8BC34A] rounded-full flex items-center justify-center text-white text-3xl mb-4 transform transition-transform hover:rotate-12">
                👴
              </div>
              <h3 className="text-xl font-bold mb-3">Elderly Care</h3>
              <p className="text-dark-gray mb-6 text-sm">
                Comprehensive support for senior citizens including healthcare assistance, daily living help, and access to government schemes.
              </p>
              <div className="flex justify-between items-center">
                <a href="/services/elderly-care" className="text-[#138808] font-medium hover:underline flex items-center">
                  Try it <span className="ml-1">→</span>
                </a>
                <span className="bg-[#E8F5E9] text-[#138808] text-xs px-2 py-1 rounded-full">For Seniors</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] p-8 rounded-xl shadow-sm relative overflow-hidden"
          >
            {/* Tricolor stripes background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 -rotate-45 opacity-10">
              <div className="h-1/3 bg-[#FF9933]"></div>
              <div className="h-1/3 bg-white"></div>
              <div className="h-1/3 bg-[#138808]"></div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Need a Custom Solution?</h2>
            <p className="text-dark-gray text-center mb-6">
              We can develop specialized AI solutions for government departments, NGOs, and businesses serving rural India.
            </p>
            <div className="flex justify-center">
              <a 
                href="/contact" 
                className="relative group bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 animate-pulse-slow"
              >
                <span className="relative z-10">Contact Us</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="w-full h-2 flex mt-12">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div> 
        <div className="w-1/3 bg-[#138808]"></div> 
      </div>
    </div>
  );
}
