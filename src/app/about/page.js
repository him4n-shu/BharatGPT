'use client';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-bold mb-4">
            <span className="text-saffron">About</span> <span className="text-green-800">BharatGPT</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-saffron to-green-800 mx-auto"></div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          {/* Mission Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-serif font-bold mb-6 pb-2 border-b border-gray-200 text-gray-800">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              BharatGPT is dedicated to making government services and information accessible to every Indian citizen through 
              the power of artificial intelligence. We aim to bridge the digital divide by providing assistance in multiple 
              Indian languages, helping citizens navigate complex government processes with ease.
            </p>
          </motion.div>

          {/* Differentiators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-serif font-bold mb-6 pb-2 border-b border-gray-200 text-gray-800">
              What Makes Us Different
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Multi-lingual Support",
                  description: "We understand and respond in 12+ Indian languages, making government services accessible to all.",
                  icon: "🌐"
                },
                {
                  title: "Form Assistance",
                  description: "We help you fill out complex government forms correctly, saving time and reducing rejections.",
                  icon: "📝"
                },
                {
                  title: "Voice-First Approach",
                  description: "Speak naturally in your language - perfect for those who find typing difficult.",
                  icon: "🎤"
                },
                {
                  title: "Local Knowledge",
                  description: "We understand Indian government processes and provide region-specific guidance.",
                  icon: "🏛️"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-saffron transition-colors"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="border-t border-gray-200 pt-8"
          >
            <h2 className="text-2xl font-serif font-bold mb-4 text-gray-800">
              Contact Us
            </h2>
            <p className="text-gray-600 mb-6">
              Have questions or suggestions? We&apos;d love to hear from you!
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 bg-saffron text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}