'use client';
import { motion } from 'framer-motion'; 
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[#1A1A1A] to-[#0D0D0D] text-white py-12 relative overflow-hidden">
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.3"/>
            <animate attributeName="r" from="30" to="40" dur="6s" repeatCount="indefinite" />
          </svg>
        </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BharatGPT Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-[#FF9933]">Bharat</span>
              <span className="text-white">GPT</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Your DESI AI Assistant for solving local problems in your language.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://x.com/Him4_nshu"
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-gray-400 hover:text-[#FF9933] transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.facebook.com/himanshu.kumar.253551"
                whileHover={{ scale: 1.2, rotate: -10 }}
                className="text-gray-400 hover:text-[#FF9933] transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.instagram.com/him4n_shu/"
                whileHover={{ scale: 1.2 }}
                className="text-gray-400 hover:text-[#FF9933] transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#FF9933]">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/sarkari-sahayak" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Sarkari Sahayak
                </Link>
              </li>
              <li>
                <Link href="/services/form-bharna-made-easy" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Form Bharna Made Easy
                </Link>
              </li>
              <li>
                <Link href="/services/kisan-bot" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Kisan Bot
                </Link>
              </li>
              <li>
                <Link href="/services/paise-ki-bachat" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Paise Ki Bachat
                </Link>
              </li>
              <li>
                <Link href="/services/suraksha-sahayata" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Suraksha Sahayata
                </Link>
              </li>
              <li>
                <Link href="/services/elderly-care" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Elderly Care
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#FF9933]">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#138808] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#138808] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Subscribe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#FF9933]">Subscribe</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with our latest features and announcements.
            </p>
            <form 
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.email.value;
                if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                  // Show error for invalid email
                  const errorMsg = document.getElementById('errorMessage');
                  errorMsg.style.opacity = 1;
                  setTimeout(() => {
                    errorMsg.style.opacity = 0;
                  }, 3000);
                  return;
                }
                const successMsg = document.getElementById('successMessage');
                successMsg.style.opacity = 1;
                
                // Reset form
                e.target.reset();
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                  successMsg.style.opacity = 0;
                }, 3000);
              }}
            >
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                name="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#138808] bg-gray-800 text-white placeholder-gray-500"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
            {/* Error Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              className="text-red-400 mt-2 text-sm"
              id="errorMessage"
              style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
            >
              Please enter a valid email address.
            </motion.p>
            {/* Success Message  */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              className="text-green-400 mt-2 text-sm"
              id="successMessage"
              style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
            >
              Thanks for subscribing! 🎉
            </motion.p>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BharatGPT. All rights reserved.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex mt-4 md:mt-0"
          >
            <div className="flex h-2 w-24 overflow-hidden rounded-full">
              <motion.div
                className="w-1/3 bg-[#FF9933] h-full"
                animate={{ x: [-80, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="w-1/3 bg-white h-full"
                animate={{ x: [-80, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
              <motion.div
                className="w-1/3 bg-[#138808] h-full"
                animate={{ x: [-80, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}