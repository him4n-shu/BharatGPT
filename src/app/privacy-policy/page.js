'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
            <span className="text-[#FF9933]">Privacy</span> Policy
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

      {/* Privacy Policy Content */}
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
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Introduction</h2>
              <p className="text-gray-600 mb-4">
                BharatGPT (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p className="text-gray-600">
                We respect your privacy and are committed to protecting it through our compliance with this policy. Please read this policy carefully to understand our policies and practices regarding your information.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect several types of information from and about users of our website, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Personal information such as name, email address, and phone number when you register for an account or subscribe to our newsletter.</li>
                <li>Information about your internet connection, the equipment you use to access our website, and usage details.</li>
                <li>Information you provide when using our services, such as queries, form submissions, and voice inputs.</li>
                <li>With your consent, we may collect and process your Aadhaar information for auto-form filling services.</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use information that we collect about you or that you provide to us:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>To provide you with our services and fulfill the purpose for which you provided the information.</li>
                <li>To improve our website and services.</li>
                <li>To communicate with you about our services, updates, and promotional offers.</li>
                <li>To personalize your experience and deliver content relevant to your interests.</li>
                <li>To protect the security and integrity of our platform.</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Encryption of sensitive data.</li>
                <li>Regular security assessments and audits.</li>
                <li>Access controls and authentication procedures.</li>
                <li>Secure storage of Aadhaar information in compliance with UIDAI guidelines.</li>
              </ul>
              <p className="text-gray-600">
                However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>The right to access and receive a copy of your personal information.</li>
                <li>The right to rectify or update your personal information.</li>
                <li>The right to request deletion of your personal information.</li>
                <li>The right to withdraw consent at any time.</li>
                <li>The right to lodge a complaint with a supervisory authority.</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Changes to Our Privacy Policy</h2>
              <p className="text-gray-600">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
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
                If you have any questions about this Privacy Policy, please contact us at:
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
            Have questions about how we handle your data?
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