// Navigation Links
export const navLinks = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Services', path: '/services', icon: '🛠️' },
  { name: 'About', path: '/about', icon: 'ℹ️' },
  { name: 'Contact', path: '/contact', icon: '📞' },
];

// Supported Languages with Direction
export const languages = [
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳', direction: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', direction: 'ltr' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩', direction: 'ltr' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳', direction: 'ltr' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳', direction: 'ltr' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳', direction: 'ltr' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳', direction: 'ltr' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳', direction: 'ltr' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳', direction: 'ltr' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳', direction: 'rtl' }, 
];

// Government Schemes with Enhanced Details
export const govtSchemes = [
  {
    id: 'pmkisan',
    name: 'PM Kisan Samman Nidhi',
    description: 'Income support of Rs. 6,000 per year in three equal installments to all landholding farmer families.',
    eligibility: 'All landholding farmers with cultivable land up to 2 hectares.',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details', 'Photo ID'],
    benefits: ['₹2,000 every 4 months', 'Direct bank transfer', 'No income cap'],
    website: 'https://pmkisan.gov.in',
    helpline: '011-23381092',
    status: 'Active',
    lastUpdated: '2025-04-01',
  },
  {
    id: 'ujjwala',
    name: 'Pradhan Mantri Ujjwala Yojana',
    description: 'Provides LPG connections to women from Below Poverty Line (BPL) households at subsidized rates.',
    eligibility: 'Women from BPL households without an existing LPG connection.',
    documents: ['Aadhaar Card', 'BPL Certificate', 'Bank Account Details', 'Identity Proof'],
    benefits: ['₹1,600 subsidy per connection', 'Free first refill', 'Safety training'],
    website: 'https://pmuy.gov.in',
    helpline: '1800-266-6696',
    status: 'Active',
    lastUpdated: '2025-03-15',
  },
  {
    id: 'awas',
    name: 'Pradhan Mantri Awas Yojana',
    description: 'Financial assistance for house construction targeting Economically Weaker Section (EWS) and Low Income Group (LIG).',
    eligibility: 'Annual income up to ₹3 lakh (EWS) or ₹6 lakh (LIG).',
    documents: ['Aadhaar Card', 'Income Certificate', 'Land Documents', 'Photo ID'],
    benefits: ['Up to ₹2.5 lakh assistance', 'Interest subsidy on loans', 'Technical support'],
    website: 'https://pmaymis.gov.in',
    helpline: '1800-11-6163',
    status: 'Active',
    lastUpdated: '2025-04-10',
  },
  {
    id: 'ayushman',
    name: 'Ayushman Bharat Yojana',
    description: 'Health insurance coverage of Rs. 5 lakh per family per year for secondary and tertiary care hospitalization.',
    eligibility: 'Families listed in SECC database or with valid ration card.',
    documents: ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'Family Photo'],
    benefits: ['₹5 lakh coverage', 'Cashless treatment', 'Over 1,500 hospitals'],
    website: 'https://pmjay.gov.in',
    helpline: '14555',
    status: 'Active',
    lastUpdated: '2025-03-20',
  },
  {
    id: 'sukanya',
    name: 'Sukanya Samriddhi Yojana',
    description: 'Small savings scheme for girl child with tax benefits and high interest rates.',
    eligibility: 'Girls below 10 years, opened by parents/guardians.',
    documents: ['Aadhaar Card', 'Birth Certificate', 'Address Proof', 'Parent ID'],
    benefits: ['8.2% interest (2025)', 'Tax exemption under 80C', 'Maturity at 21 years'],
    website: 'https://indiapost.gov.in',
    helpline: '1800-425-2440',
    status: 'Active',
    lastUpdated: '2025-04-05',
  },
];

// Government Forms with Additional Metadata
export const govtForms = [
  { id: 'ration', name: 'Ration Card', authority: 'Food & Civil Supplies Department', status: 'Online/Offline', processingTime: '15-30 days' },
  { id: 'passport', name: 'Passport Application', authority: 'Ministry of External Affairs', status: 'Online', processingTime: '30-60 days' },
  { id: 'voter', name: 'Voter ID', authority: 'Election Commission of India', status: 'Online', processingTime: '15-45 days' },
  { id: 'pan', name: 'PAN Card', authority: 'Income Tax Department', status: 'Online', processingTime: '15-20 days' },
  { id: 'ayushman', name: 'Ayushman Bharat', authority: 'National Health Authority', status: 'Offline', processingTime: '7-15 days' },
  { id: 'scholarship', name: 'Scholarship Form', authority: 'Ministry of Education', status: 'Online', processingTime: '30-60 days' },
  { id: 'income', name: 'Income Certificate', authority: 'Revenue Department', status: 'Offline', processingTime: '7-15 days' },
  { id: 'caste', name: 'Caste Certificate', authority: 'Revenue Department', status: 'Offline', processingTime: '7-15 days' },
  { id: 'domicile', name: 'Domicile Certificate', authority: 'Revenue Department', status: 'Offline', processingTime: '7-15 days' },
  { id: 'birth', name: 'Birth Certificate', authority: 'Municipal Corporation', status: 'Online/Offline', processingTime: '7-10 days' },
];

// Emergency Helplines with Additional Details
export const emergencyHelplines = [
  { service: 'National Emergency Number', number: '112', description: 'All emergencies', tollFree: true, active: true },
  { service: 'Police', number: '100', description: 'Law and order emergencies', tollFree: true, active: true },
  { service: 'Fire', number: '101', description: 'Fire emergencies', tollFree: true, active: true },
  { service: 'Ambulance', number: '102', description: 'Medical emergencies', tollFree: true, active: true },
  { service: 'Women Helpline', number: '1091', description: 'Women in distress', tollFree: true, active: true },
  { service: 'Child Helpline', number: '1098', description: 'Children in distress', tollFree: true, active: true },
  { service: 'Disaster Management', number: '108', description: 'Natural disasters', tollFree: true, active: true },
  { service: 'COVID-19 Helpline', number: '1075', description: 'COVID-19 related queries', tollFree: true, active: true },
];

// Common FAQ Questions with Categories
export const faqQuestions = [
  {
    category: 'Ration & Food',
    question: 'Ration card ke liye kya documents chahiye?',
    answer: 'Ration card ke liye aapko Aadhaar card, residence proof, family photo, income certificate, aur Form No. 23 ki zaroorat padegi. Ye sab documents lekar aapko nearest PDS office jana hoga.',
  },
  {
    category: 'Agriculture',
    question: 'PM Kisan Yojana mein kitne paise milte hain?',
    answer: 'PM Kisan Samman Nidhi Yojana mein har saal 6,000 rupaye milte hain, jo teen installments mein (har 4 mahine mein 2,000 rupaye) seedhe aapke bank account mein transfer kiye jate hain.',
  },
  {
    category: 'Health',
    question: 'Ayushman Bharat card kaise banaye?',
    answer: 'Ayushman Bharat card banane ke liye aapko nearest Common Service Centre (CSC) ya Ayushman Bharat Kendra jana hoga. Aapko Aadhaar card, ration card, aur mobile number ki zaroorat padegi. Agar aap eligible hain to aapko muft mein card mil jayega.',
  },
  {
    category: 'Voting',
    question: 'Voter ID card online kaise apply karein?',
    answer: 'Voter ID card ke liye aap National Voter Service Portal (nvsp.in) pe jakar Form 6 bhar sakte hain. Aapko apna photo, age proof, aur address proof upload karna hoga. Application submit karne ke baad aapko acknowledgement slip milegi jise aap track kar sakte hain.',
  },
  {
    category: 'Travel',
    question: 'Passport banane ka kharcha kitna hai?',
    answer: 'Normal passport (36 pages) ke liye 1,500 rupaye aur jumbo passport (60 pages) ke liye 2,000 rupaye lagta hai. Tatkaal service ke liye additional 1,500 rupaye extra lagenge. Ye fees online passport.gov.in pe pay kar sakte hain.',
  },
];

// Comprehensive Services Data for Search
export const bharatGPTServices = [
  {
    id: 'sarkari-sahayak',
    name: 'Sarkari Sahayak',
    description: 'Get simplified summaries of govt schemes (PMAY, PM Kisan, etc.) and steps to apply.',
    icon: '🧾',
    color: '#FF9933',
    url: '/services/sarkari-sahayak',
    category: 'Government',
    tags: ['schemes', 'government', 'pmay', 'pm kisan', 'ayushman', 'ujjwala', 'subsidy', 'benefits'],
    keywords: 'sarkari yojana government schemes pradhan mantri awas yojana pm kisan samman nidhi ayushman bharat ujjwala schemes benefits subsidy eligibility apply online',
    popular: true
  },
  {
    id: 'form-bharna-made-easy',
    name: 'Form Bharna Made Easy',
    description: 'AI explains what each field means in ration/passport forms, making complicated forms simple to understand.',
    icon: '📝',
    color: '#138808',
    url: '/services/form-bharna-made-easy',
    category: 'Forms',
    tags: ['forms', 'documents', 'ration', 'passport', 'voter id', 'pan card', 'application'],
    keywords: 'form filling ration card passport application voter id pan card documents help assistance online forms government forms',
    popular: false
  },
  {
    id: 'kisan-bot',
    name: 'Kisan Bot',
    description: 'Weather info, mandi prices, and crop suggestions based on your region to help farmers make better decisions.',
    icon: '🌾',
    color: '#FF9933',
    url: '/services/kisan-bot',
    category: 'Agriculture',
    tags: ['farming', 'agriculture', 'weather', 'mandi', 'prices', 'crops', 'farmers', 'suggestions'],
    keywords: 'kisan farming agriculture weather mandi prices crop suggestions farmers help agriculture advice rural',
    popular: false
  },
  {
    id: 'paise-ki-bachat',
    name: 'Paise Ki Bachat',
    description: 'Weekly tips for saving money, subsidies, and free resources to help you manage your finances better.',
    icon: '💰',
    color: '#138808',
    url: '/services/paise-ki-bachat',
    category: 'Finance',
    tags: ['money', 'savings', 'budget', 'finance', 'subsidies', 'discounts', 'tips'],
    keywords: 'money savings budget finance subsidies discounts tips financial planning expenses manage money',
    popular: false
  },
  {
    id: 'suraksha-sahayata',
    name: 'Suraksha Sahayata',
    description: 'Emergency numbers for police, fire, ambulance, and local helplines based on your location.',
    icon: '🚨',
    color: '#FF9933',
    url: '/services/suraksha-sahayata',
    category: 'Emergency',
    tags: ['emergency', 'police', 'fire', 'ambulance', 'safety', 'helpline', 'urgent'],
    keywords: 'emergency police fire ambulance helpline safety urgent 100 101 102 108 emergency numbers',
    popular: false
  },
  {
    id: 'elderly-care',
    name: 'Elderly Care',
    description: 'Comprehensive support for senior citizens including healthcare assistance, daily living help, and access to government schemes.',
    icon: '👴',
    color: '#138808',
    url: '/services/elderly-care',
    category: 'Healthcare',
    tags: ['elderly', 'senior citizen', 'healthcare', 'old age', 'support', 'assistance', 'care'],
    keywords: 'elderly care senior citizen old age healthcare support assistance daily living government schemes seniors',
    popular: false
  }
];

// Service categories for filtering
export const serviceCategories = [
  { id: 'all', name: 'All Services', count: bharatGPTServices.length },
  { id: 'government', name: 'Government', count: bharatGPTServices.filter(s => s.category === 'Government').length },
  { id: 'forms', name: 'Forms', count: bharatGPTServices.filter(s => s.category === 'Forms').length },
  { id: 'agriculture', name: 'Agriculture', count: bharatGPTServices.filter(s => s.category === 'Agriculture').length },
  { id: 'finance', name: 'Finance', count: bharatGPTServices.filter(s => s.category === 'Finance').length },
  { id: 'emergency', name: 'Emergency', count: bharatGPTServices.filter(s => s.category === 'Emergency').length },
  { id: 'healthcare', name: 'Healthcare', count: bharatGPTServices.filter(s => s.category === 'Healthcare').length }
];