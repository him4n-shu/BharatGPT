'use client';
import { motion } from 'framer-motion';

export default function SarkariFormCard({ title, description, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 h-full flex flex-col"
    >
      <div className="w-12 h-12 bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full flex items-center justify-center text-white text-2xl mb-4 animate-pulse-slow">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <motion.button
        whileHover={{ scale: 1.05, background: "linear-gradient(90deg, #FF9933, #138808)" }}
        whileTap={{ scale: 0.95 }}
        className="mt-auto w-full px-4 py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-medium rounded-lg hover:bg-opacity-90 transition-all"
      >
        Access Service
      </motion.button>
    </motion.div>
  );
}