'use client';
import { motion } from 'framer-motion';
import { FaRupeeSign, FaHospital, FaLanguage, FaArrowRight, FaStar, FaRegStar } from 'react-icons/fa';
import { GiFarmer, GiArchiveResearch, GiIndiaGate } from 'react-icons/gi';
import { RiGovernmentFill, RiVerifiedBadgeFill } from 'react-icons/ri';
import { IoIosRocket } from 'react-icons/io';

export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: 'Sarkari Babu Mode',
      description: 'Get step-by-step guidance for certificates, schemes, and government processes.',
      icon: <RiGovernmentFill className="text-3xl" />,
      color: 'from-[#FF9933] to-[#FFD699]', 
      tag: 'Most Popular',
      bonus: 'Includes FREE document checklist',
    },
    {
      id: 2,
      title: 'Auto-Form Filler',
      description: 'Upload Aadhaar to auto-fill ration card, passport, and 50+ government forms.',
      icon: <GiArchiveResearch className="text-3xl" />,
      color: 'from-[#138808] to-[#8BC34A]', 
      tag: 'Time Saver',
      bonus: '100% error-free guarantee',
    },
    {
      id: 3,
      title: 'Gaon Connect',
      description: 'Track Kisan Credit Card, PM Kisan status + get personalized farming advice.',
      icon: <GiFarmer className="text-3xl" />,
      color: 'from-[#512DA8] to-[#9575CD]', 
      tag: 'For Farmers',
      bonus: 'Weather alerts included',
    },
    {
      id: 4,
      title: 'Paise Bachao Tips',
      description: 'Find cheapest LPG, medicines, and groceries near you with price comparisons.',
      icon: <FaRupeeSign className="text-3xl" />,
      color: 'from-[#E53935] to-[#EF9A9A]',
      tag: 'Money Saver',
      bonus: 'Price drop alerts',
    },
    {
      id: 5,
      title: 'Emergency Alerts',
      description: 'Real-time hospital bed availability, emergency contacts, and disaster alerts.',
      icon: <FaHospital className="text-3xl" />,
      color: 'from-[#1E88E5] to-[#90CAF9]', 
      tag: 'Life Saver',
      bonus: 'SOS feature included',
    },
    {
      id: 6,
      title: 'Multi-lingual Support',
      description: 'Works in Hindi, Tamil, Bengali, Marathi + 8 other Indian languages.',
      icon: <FaLanguage className="text-3xl" />,
      color: 'from-[#F4511E] to-[#FFAB91]', 
      tag: 'For All Indians',
      bonus: 'Voice input available',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.3"/>
            <animate attributeName="r" from="40" to="50" dur="5s" repeatCount="indefinite" />
          </svg>
        </div>

      <div className="container mx-auto px-4 text-center mb-16 relative z-10">
        {/* Animated Header with Tricolor Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-block mb-4"
        >
          <div className="flex items-center justify-center bg-white px-4 py-2 rounded-full shadow-md border border-gray-200 animate-pulse-slow">
            <GiIndiaGate className="text-2xl text-[#FF9933] mr-2 animate-spin-slow" />
            <span className="font-bold text-gray-800">Made for India 🇮🇳</span>
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF9933] via-[#138808] to-[#1E88E5] bg-clip-text text-transparent"
        >
          Power-Packed Features
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          <span className="font-semibold text-gray-800">Every tool you need</span> to navigate India's system like a pro!
        </motion.p>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.id * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -10, scale: 1.03, rotate: 1 }}
              className="relative group"
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300`}></div>
              
              <div className="relative h-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300">
                <div className={`bg-gradient-to-r ${feature.color} p-5 flex justify-between items-start`}>
                  <div className="flex items-center">
                    <span className="text-white font-bold text-xs px-3 py-1 rounded-full bg-black bg-opacity-20 animate-pulse">
                      {feature.tag}
                    </span>
                    <RiVerifiedBadgeFill className="ml-2 text-white text-lg animate-bounce" />
                  </div>
                  <div className="bg-white bg-opacity-30 p-2 rounded-lg animate-spin-slow">
                    {feature.icon}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 mb-5">{feature.description}</p>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-500">BONUS:</p>
                    <p className="text-green-600 font-semibold animate-fade-in">{feature.bonus}</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Try Now
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}