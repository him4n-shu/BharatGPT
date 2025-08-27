'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Function to handle query submission
  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch('/api/ask-scheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      setApiResponse(data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      setApiResponse({
        error: true,
        message: "Sorry, we couldn't process your request at this time. Please try again later."
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
      
      <div className="container mx-auto py-12 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          <span className="text-[#FF9933]">Sarkari</span> <span className="text-[#138808]">Sahayak</span> <span className="text-sm text-gray-500">(सरकारी सहायक)</span>
        </motion.h1>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto border-t border-[#FF9933]"
        >
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white text-5xl mb-6 md:mb-0 md:mr-8 animate-pulse-slow">
                🧾
              </div>
              <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-2 border-dashed border-blue-900 opacity-20 animate-spin-slow"></div>
            </div>
            <div>
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]"
              >
                Your Government Schemes Guide
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-gray-700"
              >
                Get simplified summaries of government schemes like PMAY, PM Kisan, and more. 
                Learn eligibility requirements and step-by-step application processes in simple language.
              </motion.p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold mb-4 text-[#138808]">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border border-l-4 border-l-[#FF9933] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#FFF7ED] p-5 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2">✓</span>
                    <p>Easy-to-understand summaries of complex government schemes</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF9933] mr-2">✓</span>
                    <p>Clear step-by-step application instructions for all major schemes</p>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border border-l-4 border-l-[#138808] border-t-0 border-r-0 border-b-0 bg-gradient-to-br from-white to-[#F0F9F1] p-5 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2">✓</span>
                    <p>Eligibility checker to determine if you qualify for benefits</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#138808] mr-2">✓</span>
                    <p>Document checklists to prepare for applications</p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-[#f9f9f9] p-6 rounded-lg mt-10 mb-10"
          >
            <h3 className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">How It Works</h3>
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-[#FF9933] to-[#FFC285] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-sm">1</div>
                <div>
                  <p className="font-semibold text-[#FF9933] mb-1">Select a scheme or ask a question</p>
                  <p className="text-gray-600">Choose from popular schemes or ask about specific benefits</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-white to-[#E8E8E8] text-[#138808] w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-sm border border-gray-200">2</div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Get simple explanations</p>
                  <p className="text-gray-600">Receive jargon-free information about benefits and eligibility</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="bg-gradient-to-r from-[#138808] to-[#4CAF50] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-sm">3</div>
                <div>
                  <p className="font-semibold text-[#138808] mb-1">Follow easy application steps</p>
                  <p className="text-gray-600">Get clear instructions on how to apply for the scheme</p>
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
            
            <h3 className="text-xl font-semibold mb-6 text-center">Popular Government Schemes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.2 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleSchemeSelect('pmay')}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white text-xl mr-4 shadow-sm">
                  🏠
                </div>
                <div>
                  <p className="font-semibold text-[#FF9933]">Pradhan Mantri Awas Yojana (PMAY)</p>
                  <p className="text-sm text-gray-600">Housing scheme for the urban and rural poor</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.3 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleSchemeSelect('pmkisan')}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#138808] to-[#4CAF50] rounded-full flex items-center justify-center text-white text-xl mr-4 shadow-sm">
                  🌾
                </div>
                <div>
                  <p className="font-semibold text-[#138808]">PM Kisan Samman Nidhi</p>
                  <p className="text-sm text-gray-600">Income support for small and marginal farmers</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.4 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleSchemeSelect('ayushman')}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF9933] to-[#FFC285] rounded-full flex items-center justify-center text-white text-xl mr-4 shadow-sm">
                  🏥
                </div>
                <div>
                  <p className="font-semibold text-[#FF9933]">Ayushman Bharat</p>
                  <p className="text-sm text-gray-600">Health insurance for low-income families</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => handleSchemeSelect('scholarship')}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#138808] to-[#4CAF50] rounded-full flex items-center justify-center text-white text-xl mr-4 shadow-sm">
                  👩‍🎓
                </div>
                <div>
                  <p className="font-semibold text-[#138808]">National Scholarship Portal</p>
                  <p className="text-sm text-gray-600">Educational scholarships for students</p>
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
                  className="mt-8 bg-white p-6 rounded-lg shadow-md border-l-4"
                  style={{ borderLeftColor: schemeDetails[selectedScheme].color }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl mr-4"
                         style={{ backgroundColor: schemeDetails[selectedScheme].color }}>
                      {schemeDetails[selectedScheme].icon}
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: schemeDetails[selectedScheme].color }}>
                      {schemeDetails[selectedScheme].title}
                    </h3>
                    <button 
                      onClick={() => setSelectedScheme(null)}
                      className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{schemeDetails[selectedScheme].description}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-xs mr-2">✓</span>
                        Benefits
                      </h4>
                      <ul className="pl-8 list-disc text-gray-700 space-y-1">
                        {schemeDetails[selectedScheme].benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-[#138808] flex items-center justify-center text-white text-xs mr-2">✓</span>
                        Eligibility
                      </h4>
                      <ul className="pl-8 list-disc text-gray-700 space-y-1">
                        {schemeDetails[selectedScheme].eligibility.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">→</span>
                        How to Apply
                      </h4>
                      <ol className="pl-8 list-decimal text-gray-700 space-y-1">
                        {schemeDetails[selectedScheme].howToApply.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <motion.a
                      href={schemeDetails[selectedScheme].officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-6 py-2 rounded-lg shadow-md inline-flex items-center"
                    >
                      Apply Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="bg-[#f9f9f9] p-6 rounded-lg mb-8 relative overflow-hidden shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] to-[#138808]">Ask About Any Scheme</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="PM Awas Yojana के लिए कैसे apply करें? (How to apply for PM Awas Yojana?)"
                  className="w-full md:w-96 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF9933] transition-all duration-300"
                />
                <motion.button 
                  onClick={handleQuerySubmit}
                  disabled={isLoading || !query.trim()}
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  className={`bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap flex items-center ${isLoading || !query.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              
              <AnimatePresence>
                {apiResponse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 text-left bg-white p-6 rounded-lg shadow-md border-l-4 border-l-[#138808]"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-[#138808] flex items-center justify-center text-white text-lg mr-4 flex-shrink-0">
                        🤖
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2 text-[#138808]">Scheme Information</h4>
                        
                        {apiResponse.error ? (
                          <p className="text-red-500">{apiResponse.message}</p>
                        ) : (
                          <div 
                            className="prose prose-lg max-w-none text-gray-700 scheme-response"
                            dangerouslySetInnerHTML={{ __html: apiResponse }}
                          />
                        )}
                        
                        <p className="mt-6 text-xs text-gray-500 pt-4 border-t border-gray-200">
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