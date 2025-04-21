'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-[#0D0D0D] to-[#1A1A1A] text-white relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.3"/>
              <animate attributeName="r" from="40" to="50" dur="5s" repeatCount="indefinite" />
            </svg>
          </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-center"
          >
            <span className="text-[#FF9933]">Terms</span> of Service
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-center max-w-3xl mx-auto mb-8"
          >
            Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </motion.p>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using BharatGPT (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-gray-600">
                These Terms of Service govern your use of our website and services. Please read them carefully before using our platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Description of Services</h2>
              <p className="text-gray-600 mb-4">
                BharatGPT provides AI-powered assistance for navigating government services and information in multiple Indian languages. Our services include:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Voice-based assistance in multiple Indian languages</li>
                <li>Auto-form filling for government applications</li>
                <li>Information about government schemes and services</li>
                <li>Emergency alerts and notifications</li>
                <li>Local resource information and guidance</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">User Accounts</h2>
              <p className="text-gray-600 mb-4">
                Some features of our services may require you to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Maintaining the confidentiality of your account information</li>
                <li>Restricting access to your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content, features, and functionality of our services, including but not limited to text, graphics, logos, icons, and software, are owned by BharatGPT and are protected by Indian and international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-600">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without our prior written consent.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                BharatGPT shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.
              </p>
              <p className="text-gray-600">
                While we strive to provide accurate information, we do not guarantee the accuracy, completeness, or usefulness of any information on our website or obtained through our services.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Changes to Terms</h2>
              <p className="text-gray-600">
                We may revise and update these Terms of Service from time to time at our sole discretion. All changes are effective immediately when posted. Your continued use of our services following the posting of revised Terms of Service means that you accept and agree to the changes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 font-medium">BharatGPT</p>
                <p className="text-gray-600">Email: himanshu7554@gmail.com</p>
                <p className="text-gray-600">Address: Kolkata, West Bengal, India</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-[#0D0D0D] to-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl mb-6"
          >
            Have questions about our terms?
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-lg hover:shadow-lg transition-all inline-block">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}