'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useVoiceInput from '@/hooks/useVoiceInput';

export default function SarkariSahayak() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  
  const [selectedScheme, setSelectedScheme] = useState(null);
  
  // State for the query and response
  const [query, setQuery] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualLanguage, setManualLanguage] = useState(null); // null = auto-detect, 'hindi' or 'english' = manual

  // Voice input hook - support both Hindi and English
  const {
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
    toggleListening,
  } = useVoiceInput({ language: 'en-IN', silenceTimeout: 2000 }); // Using en-IN for better English recognition

  // Update query when voice transcript changes
  useEffect(() => {
    if (transcript) {
      console.log('Voice transcript received:', transcript);
      console.log('Transcript characters:', transcript.split('').map(char => `${char} (${char.charCodeAt(0)})`));
      setQuery(transcript);
    }
  }, [transcript]);

  // Function to detect if text is primarily in Hindi
  const detectLanguage = (text) => {
    if (!text || text.trim().length === 0) return 'english';
    
    const cleanText = text.trim().toLowerCase();
    
    // Count Devanagari characters (Hindi script)
    const hindiChars = cleanText.match(/[\u0900-\u097F]/g);
    const hindiCount = hindiChars ? hindiChars.length : 0;
    
    // Count English alphabetic characters
    const englishChars = cleanText.match(/[a-zA-Z]/g);
    const englishCount = englishChars ? englishChars.length : 0;
    
    // Check for common Hindi words (even in Roman script)
    const hindiWordsInRoman = [
      'kaise', 'kya', 'hai', 'hain', 'ke', 'ki', 'ka', 'ko', 'se', 'me', 'mein',
      'aur', 'ya', 'yojana', 'sahayata', 'sarkar', 'sarkari', 'pradhan mantri',
      'apply', 'kare', 'karen', 'karna', 'liye', 'chahiye', 'kab', 'kahan',
      'kitna', 'kitne', 'paisa', 'rupee', 'lagta', 'lagti', 'milta', 'milti'
    ];
    
    let romanHindiMatches = 0;
    hindiWordsInRoman.forEach(word => {
      if (cleanText.includes(word)) {
        romanHindiMatches++;
      }
    });
    
    // Check for common English words
    const englishWords = [
      'how', 'what', 'when', 'where', 'why', 'who', 'can', 'should', 'would',
      'apply', 'for', 'scheme', 'government', 'benefits', 'eligibility',
      'process', 'help', 'information', 'details', 'about', 'get', 'need',
      'the', 'is', 'are', 'and', 'or', 'to', 'in', 'on', 'at', 'with', 'from',
      'this', 'that', 'these', 'those', 'have', 'has', 'had', 'will', 'shall',
      'do', 'does', 'did', 'be', 'am', 'was', 'were', 'been', 'being'
    ];
    
    let englishMatches = 0;
    englishWords.forEach(word => {
      if (cleanText.includes(word)) {
        englishMatches++;
      }
    });
    
    // If we have actual Devanagari characters, it's definitely Hindi
    if (hindiCount > 0) {
      return 'hindi';
    }
    
    // If no Devanagari characters, check word patterns
    // Give strong priority to English detection
    if (englishMatches >= 1) {
      return 'english';
    }
    
    // Only consider Hindi if we have strong Hindi indicators AND no English
    if (romanHindiMatches >= 2 && englishMatches === 0) {
      return 'hindi';
    }
    
    // For very short text or uncertain cases, check character patterns
    const totalChars = cleanText.replace(/\s+/g, '').length;
    if (totalChars > 0 && englishCount / totalChars > 0.5) {
      return 'english';
    }
    
    // Default to English if uncertain (very conservative about Hindi detection)
    return 'english';
  };

  // Scheme details data
  const schemeDetails = {
    pmay: {
      title: "Pradhan Mantri Awas Yojana (PMAY)",
      description: "A flagship housing scheme launched by the Government of India to provide affordable housing to the urban and rural poor.",
      benefits: [
        "Financial assistance of ₹1.2 lakh to ₹2.5 lakh depending on category",
        "Interest subsidy on home loans",
        "Affordable housing projects with reduced prices",
        "Special provisions for women, SC/ST, and other vulnerable groups"
      ],
      eligibility: [
        "Households with annual income up to ₹18 lakh",
        "Should not own a pucca house in any part of India",
        "First-time home buyers are given preference",
        "Different slabs based on income categories"
      ],
      howToApply: [
        "Visit the official PMAY website (pmaymis.gov.in)",
        "Register with your Aadhaar number",
        "Fill the application form with required details",
        "Submit supporting documents (income proof, identity proof, etc.)",
        "Track your application through the portal"
      ],
      icon: "🏠",
      color: "#FF9933",
      officialLink: "https://pmaymis.gov.in/"
    },
    pmkisan: {
      title: "PM Kisan Samman Nidhi",
      description: "A central sector scheme to provide income support to all landholding farmers' families in the country.",
      benefits: [
        "Direct income support of ₹6,000 per year",
        "Amount transferred in three equal installments of ₹2,000 each",
        "Direct benefit transfer to bank accounts",
        "Helps farmers meet agricultural and household needs"
      ],
      eligibility: [
        "All landholding farmers with cultivable land",
        "Small and marginal farmers with combined landholding up to 2 hectares",
        "Subject to exclusion criteria for higher income groups",
        "Land records must be updated in revenue records"
      ],
      howToApply: [
        "Register through local Common Service Centres (CSCs)",
        "Apply through the PM-KISAN portal (pmkisan.gov.in)",
        "Submit land records and bank account details",
        "Aadhaar linking is mandatory for verification",
        "Application status can be checked online"
      ],
      icon: "🌾",
      color: "#138808",
      officialLink: "https://pmkisan.gov.in/"
    },
    ayushman: {
      title: "Ayushman Bharat",
      description: "National Health Protection Scheme that aims to provide free health coverage to economically vulnerable families.",
      benefits: [
        "Health coverage up to ₹5 lakh per family per year",
        "Covers pre and post-hospitalization expenses",
        "No cap on family size or age",
        "Covers almost all secondary and tertiary care procedures",
        "Cashless and paperless access to services"
      ],
      eligibility: [
        "Families included in SECC database under deprivation criteria",
        "Automatically entitled families from occupational categories",
        "Previously covered families under RSBY",
        "No restriction based on family size or age"
      ],
      howToApply: [
        "Check eligibility on the Ayushman Bharat website (pmjay.gov.in)",
        "Visit nearest Ayushman Bharat Kendra with Aadhaar card",
        "Call the toll-free helpline (14555) for assistance",
        "Generate e-card after verification of identity",
        "Use the e-card at empanelled hospitals for treatment"
      ],
      icon: "🏥",
      color: "#FF9933",
      officialLink: "https://pmjay.gov.in/"
    },
    scholarship: {
      title: "National Scholarship Portal",
      description: "A one-stop platform for students to apply for various scholarship schemes offered by central and state governments.",
      benefits: [
        "Financial assistance for education expenses",
        "Scholarships for pre-matric, post-matric, and higher education",
        "Special schemes for SC, ST, OBC, minorities, and girls",
        "Helps reduce dropout rates in education",
        "Promotes higher education among disadvantaged groups"
      ],
      eligibility: [
        "Students from economically weaker sections",
        "Income criteria varies by scholarship scheme",
        "Academic criteria such as minimum percentage of marks",
        "Regular enrollment in recognized educational institutions",
        "Specific eligibility for different scholarship categories"
      ],
      howToApply: [
        "Register on National Scholarship Portal (scholarships.gov.in)",
        "Create user ID and password",
        "Fill in personal, academic, and bank details",
        "Upload required documents (income certificate, marksheets, etc.)",
        "Submit application before the deadline and track status online"
      ],
      icon: "👩‍🎓",
      color: "#138808",
      officialLink: "https://scholarships.gov.in/"
    }
  };

  // Function to handle scheme selection
  const handleSchemeSelect = (schemeKey) => {
    if (selectedScheme === schemeKey) {
      setSelectedScheme(null); 
    } else {
      setSelectedScheme(schemeKey); 
    }
  };
  
  // Function to handle voice input completion
  const handleVoiceComplete = () => {
    stopListening();
    if (transcript.trim()) {
      handleQuerySubmit();
    }
  };

  // Function to clear input and voice
  const clearInput = () => {
    setQuery('');
    resetTranscript();
    setApiResponse(null);
  };
  
  // Function to handle query submission
  const handleQuerySubmit = async () => {
    const currentQuery = query.trim() || transcript.trim();
    if (!currentQuery) return;
    
    // Detect the language of the query (with manual override)
    const autoDetectedLanguage = detectLanguage(currentQuery);
    const detectedLanguage = manualLanguage || autoDetectedLanguage;
    console.log('Query:', currentQuery);
    console.log('Auto-detected Language:', autoDetectedLanguage);
    console.log('Final Language (with manual override):', detectedLanguage);
    
    setIsLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch('/api/ask-scheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: currentQuery,
          language: detectedLanguage
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      console.log('API Response data:', data); // Debug logging
      console.log('Response metadata:', data.metadata); // Debug metadata
      setApiResponse(data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = detectedLanguage === 'hindi' 
        ? "खुशी है, हम आपके अनुरोध को इस समय संसाधित नहीं कर सकते। कृपया बाद में पुनः प्रयास करें।"
        : "Sorry, we couldn't process your request at this time. Please try again later.";
      
      setApiResponse({
        error: true,
        message: errorMessage
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
      
      <div className="container mx-auto py-6 sm:py-12 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center"
        >
          <span className="text-[#FF9933]">Sarkari</span> <span className="text-[#138808]">Sahayak</span> 
          <br className="sm:hidden" />
          <span className="text-xs sm:text-sm text-gray-500 block sm:inline mt-1 sm:mt-0">(सरकारी सहायक)</span>
        </motion.h1>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg max-w-4xl mx-auto border-t border-[#FF9933]"
        >
          <div className="flex flex-col items-center mb-6 sm:mb-8 text-center sm:text-left sm:flex-row">
            <div className="relative mb-4 sm:mb-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl lg:text-5xl sm:mr-6 lg:mr-8 animate-pulse-slow">
                🧾
              </div>
              <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-dashed border-blue-900 opacity-20 animate-spin-slow"></div>
            </div>
            <div className="flex-1">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]"
              >
                Your Government Schemes Guide
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-sm sm:text-base text-gray-700 leading-relaxed"
              >
                Get simplified summaries of government schemes like PMAY, PM Kisan, and more. 
                Learn eligibility requirements and step-by-step application processes in simple language.
              </motion.p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 sm:pt-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[#138808]">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border border-l-4 border-l-[#FF9933] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#FFF7ED] p-4 sm:p-5 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Easy-to-understand summaries of complex government schemes</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Clear step-by-step application instructions for all major schemes</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2 mt-0.5 flex-shrink-0">🎤</span>
                    <p className="text-sm sm:text-base"><strong>Voice Input Support:</strong> Ask questions in Hindi or English using voice commands</p>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border border-l-4 border-l-[#138808] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#F0F9F1] p-4 sm:p-5 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Eligibility checker to determine if you qualify for benefits</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm sm:text-base">Document checklists to prepare for applications</p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-[#f9f9f9] p-4 sm:p-6 rounded-lg mt-8 sm:mt-10 mb-8 sm:mb-10"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">How It Works</h3>
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-[#FF9933] to-[#FFC285] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold mr-3 sm:mr-4 flex-shrink-0 shadow-sm text-sm sm:text-base">1</div>
                <div className="flex-1">
                  <p className="font-semibold text-[#FF9933] mb-1 text-sm sm:text-base">Select a scheme or ask a question</p>
                  <p className="text-gray-600 text-sm sm:text-base">Choose from popular schemes, type your question, or use voice input (🎤) to speak in Hindi or English</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-white to-[#E8E8E8] text-[#138808] w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold mr-3 sm:mr-4 flex-shrink-0 shadow-sm border border-gray-200 text-sm sm:text-base">2</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">Get simple explanations</p>
                  <p className="text-gray-600 text-sm sm:text-base">Receive jargon-free information about benefits and eligibility</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-[#138808] to-[#4CAF50] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold mr-3 sm:mr-4 flex-shrink-0 shadow-sm text-sm sm:text-base">3</div>
                <div className="flex-1">
                  <p className="font-semibold text-[#138808] mb-1 text-sm sm:text-base">Follow easy application steps</p>
                  <p className="text-gray-600 text-sm sm:text-base">Get clear instructions on how to apply for the scheme</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="relative bg-gradient-to-r from-[#FFF7ED] via-white to-[#F0F9F1] p-6 rounded-lg mb-10 shadow-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="h-1/3 bg-[#FF9933] opacity-10"></div>
              <div className="h-1/3 bg-white opacity-10"></div>
              <div className="h-1/3 bg-[#138808] opacity-10"></div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">Popular Government Schemes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.2 }}
                className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleSchemeSelect('pmay')}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white text-lg sm:text-xl mr-3 sm:mr-4 shadow-sm flex-shrink-0">
                  🏠
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#FF9933] text-sm sm:text-base leading-tight">Pradhan Mantri Awas Yojana (PMAY)</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Housing scheme for the urban and rural poor</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.3 }}
                className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleSchemeSelect('pmkisan')}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#138808] to-[#4CAF50] rounded-full flex items-center justify-center text-white text-lg sm:text-xl mr-3 sm:mr-4 shadow-sm flex-shrink-0">
                  🌾
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#138808] text-sm sm:text-base leading-tight">PM Kisan Samman Nidhi</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Income support for small and marginal farmers</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.4 }}
                className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleSchemeSelect('ayushman')}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white text-lg sm:text-xl mr-3 sm:mr-4 shadow-sm flex-shrink-0">
                  🏥
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#FF9933] text-sm sm:text-base leading-tight">Ayushman Bharat</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Health insurance for low-income families</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
                className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleSchemeSelect('scholarship')}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#138808] to-[#4CAF50] rounded-full flex items-center justify-center text-white text-lg sm:text-xl mr-3 sm:mr-4 shadow-sm flex-shrink-0">
                  👩‍🎓
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#138808] text-sm sm:text-base leading-tight">National Scholarship Portal</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Educational scholarships for students</p>
                </div>
              </motion.div>
            </div>

            {/* Scheme Details Section */}
            <AnimatePresence>
              {selectedScheme && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4"
                  style={{ borderLeftColor: schemeDetails[selectedScheme].color }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0"
                         style={{ backgroundColor: schemeDetails[selectedScheme].color }}>
                      {schemeDetails[selectedScheme].icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold flex-1 min-w-0" style={{ color: schemeDetails[selectedScheme].color }}>
                      {schemeDetails[selectedScheme].title}
                    </h3>
                    <button 
                      onClick={() => setSelectedScheme(null)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
                      aria-label="Close scheme details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">{schemeDetails[selectedScheme].description}</p>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">✓</span>
                        Benefits
                      </h4>
                      <ul className="pl-6 sm:pl-8 list-disc text-gray-700 space-y-1 text-sm sm:text-base">
                        {schemeDetails[selectedScheme].benefits.map((benefit, index) => (
                          <li key={index} className="leading-relaxed">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#138808] flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">✓</span>
                        Eligibility
                      </h4>
                      <ul className="pl-6 sm:pl-8 list-disc text-gray-700 space-y-1 text-sm sm:text-base">
                        {schemeDetails[selectedScheme].eligibility.map((item, index) => (
                          <li key={index} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">→</span>
                        How to Apply
                      </h4>
                      <ol className="pl-6 sm:pl-8 list-decimal text-gray-700 space-y-1 text-sm sm:text-base">
                        {schemeDetails[selectedScheme].howToApply.map((step, index) => (
                          <li key={index} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end">
                    <motion.a
                      href={schemeDetails[selectedScheme].officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-6 py-3 rounded-lg shadow-md inline-flex items-center text-sm sm:text-base touch-manipulation w-full sm:w-auto justify-center"
                    >
                      Apply Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-center"
          >
            <div className="bg-[#f9f9f9] p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 relative overflow-hidden shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Ask About Any Scheme</h3>
              
              {/* Voice Error Display */}
              {voiceError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {voiceError}
                </motion.div>
              )}

              <div className="flex flex-col gap-4">
                                {/* Input Row with Voice */}
                <div className="space-y-3">
                  <div className="relative w-full">
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="PM Awas Yojana के लिए कैसे apply करें? या How to apply for PM Awas Yojana?"
                      className={`w-full px-4 py-3 pr-20 sm:pr-24 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933] transition-all duration-300 text-sm sm:text-base ${
                        isListening ? 'border-red-400 bg-red-50' : ''
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                    />
                    
                    {/* Voice and Clear Buttons */}
                    <div className="absolute right-2 top-2 flex gap-1">
                      {(query || transcript) && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={clearInput}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors touch-manipulation"
                          title="Clear input"
                        >
                          ✕
                        </motion.button>
                      )}
                      
                      <motion.button
                        onClick={toggleListening}
                        disabled={isLoading}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 touch-manipulation ${
                          isListening 
                            ? 'bg-red-500 text-white shadow-lg' 
                            : 'bg-[#FF9933] hover:bg-[#e58a2e] text-white'
                        }`}
                        title={isListening ? 'Stop listening' : 'Start voice input'}
                      >
                        {isListening ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            🎤
                          </motion.div>
                        ) : (
                          '🎤'
                        )}
                      </motion.button>
                    </div>
                  </div>
                  
                  <motion.button 
                    onClick={handleQuerySubmit}
                    disabled={isLoading || (!query.trim() && !transcript.trim())}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    className={`w-full sm:w-auto sm:mx-auto sm:block bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center touch-manipulation ${
                      isLoading || (!query.trim() && !transcript.trim()) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
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

                {/* Language Detection and Manual Override */}
                {(query || transcript) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                  >
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      <span className="text-xs text-blue-600">
                        Language: <strong>{(manualLanguage || detectLanguage(query || transcript)) === 'hindi' ? 'हिंदी (Hindi)' : 'English'}</strong>
                        {manualLanguage && <span className="ml-1 text-green-600">(Manual)</span>}
                        {/* Debug info - remove in production */}
                        <span className="ml-2 opacity-60">({query || transcript})</span>
                      </span>
                    </div>
                    
                    {/* Manual Language Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-xs text-gray-500">Response language:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setManualLanguage(manualLanguage === 'english' ? null : 'english')}
                          className={`px-3 py-1 text-xs rounded touch-manipulation ${
                            manualLanguage === 'english' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setManualLanguage(manualLanguage === 'hindi' ? null : 'hindi')}
                          className={`px-3 py-1 text-xs rounded touch-manipulation ${
                            manualLanguage === 'hindi' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          हिंदी
                        </button>
                        <button
                          onClick={() => setManualLanguage(null)}
                          className={`px-3 py-1 text-xs rounded touch-manipulation ${
                            !manualLanguage 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Voice Status and Tips */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                        <div className="voice-wave">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="text-red-600 font-medium">Listening... Speak in Hindi or English</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Try saying: &quot;PM Awas Yojana ke liye kaise apply karen?&quot; or &quot;How to apply for PM Awas Yojana?&quot;
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 sm:mt-8 text-left bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-l-[#138808]"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#138808] flex items-center justify-center text-white text-base sm:text-lg mr-3 sm:mr-4 flex-shrink-0">
                        <div className="animate-spin">⚡</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-[#138808]">Generating Response...</h4>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="shimmer h-3 sm:h-4 w-full"></div>
                          <div className="shimmer h-3 sm:h-4 w-4/5"></div>
                          <div className="shimmer h-3 sm:h-4 w-3/4"></div>
                          <div className="shimmer h-3 sm:h-4 w-5/6"></div>
                          <div className="shimmer h-3 sm:h-4 w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {apiResponse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 sm:mt-8 text-left bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-l-[#138808] -ml-8 sm:ml-0 w-screen sm:w-auto -mr-4 sm:mr-0"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#138808] flex items-center justify-center text-white text-base sm:text-lg mr-3 sm:mr-4 flex-shrink-0">
                        🤖
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-[#138808]">Scheme Information</h4>
                        
                        {apiResponse.error ? (
                          <p className="text-red-500 text-sm sm:text-base">{apiResponse.message}</p>
                        ) : (
                          <div 
                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 scheme-response overflow-visible"
                            style={{ 
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              maxHeight: 'none',
                              lineHeight: '1.6',
                              fontSize: 'inherit'
                            }}
                            dangerouslySetInnerHTML={{ __html: apiResponse }}
                          />
                        )}
                        
                        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t border-gray-200">
                          Information provided by AI assistance. For official details, please visit the scheme&apos;s official website.
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