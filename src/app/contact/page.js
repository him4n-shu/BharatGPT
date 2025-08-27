'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';
import Head from 'next/head';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required!');
      return false;
    }
    if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error('Valid email is required!');
      return false;
    }
    if (!formData.subject) {
      toast.error('Please select a subject!');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Message cannot be empty!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      toast.success('Message sent successfully! 🙌');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Oops! Something went wrong. Try again.');
      console.error('EmailJS Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact BharatGPT | Get in Touch</title>
        <meta name="description" content="Reach out to BharatGPT for support, feedback, or partnerships. We're here to help!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-serif font-extrabold mb-4 tracking-tight">
              <span className="text-saffron">Contact</span>{' '}
              <span className="text-green-700">Us</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-saffron to-green-700 mx-auto rounded"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Got questions about BharatGPT? We&apos;re just a message away!
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="space-y-8">
                  {/* Address */}
                  <div className="flex items-start group">
                    <div className="bg-saffron/10 p-3 rounded-full mr-4 transition-transform group-hover:scale-110">
                      <FaMapMarkerAlt className="text-saffron text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Location</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Barasat<br />
                        Kolkata, West Bengal 700125<br />
                        India
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start group">
                    <div className="bg-green-100 p-3 rounded-full mr-4 transition-transform group-hover:scale-110">
                      <FaPhoneAlt className="text-green-700 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
                      <p className="text-gray-600 leading-relaxed">
                        +91 7070464508
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9AM - 8PM IST</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start group">
                    <div className="bg-blue-100 p-3 rounded-full mr-4 transition-transform group-hover:scale-110">
                      <FaEnvelope className="text-blue-700 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                      <p className="text-gray-600 leading-relaxed">
                        himanshu7554@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Follow Me</h3>
                    <div className="flex space-x-4">
                      {[
                        { icon: <FaFacebookF />, color: 'bg-blue-600', href: 'https://www.facebook.com/himanshu.kumar.253551' },
                        { icon: <FaTwitter />, color: 'bg-sky-500', href: 'https://x.com/Him4_nshu' },
                        { icon: <FaInstagram />, color: 'bg-gradient-to-r from-pink-500 to-saffron', href: 'https://www.instagram.com/him4n_shu/' },
                        { icon: <FaYoutube />, color: 'bg-red-600', href: 'https://www.youtube.com/@him4n_shu' },
                      ].map((social, index) => (
                        <a
                          key={index}
                          href={social.href}
                          className={`w-12 h-12 rounded-full ${social.color} flex items-center justify-center text-white hover:scale-105 transition-transform duration-200 shadow-md`}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-3xl font-serif font-bold mb-6 pb-2 border-b-2 border-gray-200 text-gray-800">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-2 font-medium">
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Product Feedback</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-gray-50"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-saffron to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-saffron transition-all font-medium text-lg shadow-md ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="light" />
      </div>
    </>
  );
}