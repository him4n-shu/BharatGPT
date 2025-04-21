const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export const askQuestion = async (query, language = 'hi-IN') => {
  await delay(1500); 
  // Mock responses based on keywords in the query
  const mockResponses = {
    'certificate': {
      'hi': '10th certificate का डुप्लिकेट बनाने के लिए आपको CBSE की आधिकारिक वेबसाइट पर जाना होगा। कदम: 1. cbse.gov.in पर जाएं 2. Duplicate Certificate सेक्शन पर क्लिक करें 3. फॉर्म डाउनलोड करें 4. 500 रुपये का डिमांड ड्राफ्ट बनवाएं 5. रीजनल ऑफिस में सबमिट करें।',
      'en': 'To get a duplicate 10th certificate, visit the CBSE official website. Steps: 1. Go to cbse.gov.in 2. Click on Duplicate Certificate section 3. Download and fill the form 4. Make a demand draft of ₹500 5. Submit at the regional office.',
    },
    'ration': {
      'hi': 'राशन कार्ड के लिए आपको नजदीकी PDS ऑफिस जाना होगा। फॉर्म नंबर 23 भरें, आधार कार्ड, निवास प्रमाण और पारिवारिक फोटो के साथ सबमिट करें।',
      'en': 'For a ration card, visit the nearest PDS office. Fill Form No. 23 with Aadhaar card, residence proof, and family photo, then submit.',
    },
    'kisan': {
      'hi': 'किसान क्रेडिट कार्ड के लिए अपने नजदीकी बैंक ब्रांच में जाएं। लैंड रिकॉर्ड्स, पहचान प्रमाण और पता प्रमाण की आवश्यकता होगी।',
      'en': 'For a Kisan Credit Card, visit your nearest bank branch. You’ll need land records, identity proof, and address proof.',
    },
    'pension': {
      'hi': 'पेंशन स्कीम के लिए अपने जिले के सोशल वेलफेयर ऑफिस में जाएं। आयु प्रमाण, पहचान प्रमाण और बैंक खाता विवरण की जरूरत होगी।',
      'en': 'For a pension scheme, visit your district social welfare office. You’ll need age proof, identity proof, and bank account details.',
    },
    'aadhar': {
      'hi': 'आधार कार्ड अपडेट करने के लिए नजदीकी आधार सेंटर या ऑनलाइन पोर्टल myaadhaar.uidai.gov.in पर जाएं। ऑनलाइन अपडेट के लिए रजिस्टर्ड मोबाइल नंबर चाहिए होगा।',
      'en': 'To update your Aadhaar, visit a nearby Aadhaar center or the online portal myaadhaar.uidai.gov.in. A registered mobile number is required for online updates.',
    },
    'pan': {
      'hi': 'PAN कार्ड के लिए NSDL या UTIISL की वेबसाइट पर ऑनलाइन अप्लाई करें। 500 रुपये फीस लगेगी और 15 दिन में कार्ड मिल जाएगा।',
      'en': 'Apply for a PAN card online on NSDL or UTIISL websites. It costs ₹500, and you’ll receive the card in 15 days.',
    },
    'voter': {
      'hi': 'वोटर ID कार्ड के लिए फॉर्म 6 भरें और नजदीकी इलेक्शन कमीशन ऑफिस में सबमिट करें। निवास प्रमाण और आयु प्रमाण संलग्न करें।',
      'en': 'For a Voter ID, fill Form 6 and submit it at the nearest Election Commission office. Attach proof of residence and age.',
    },
    'gas': {
      'hi': 'LPG सब्सिडी के लिए अपने बैंक खाते को आधार से लिंक करें। फिर अपने गैस डिस्ट्रीब्यूटर को सूचित करें।',
      'en': 'For LPG subsidy, link your bank account with Aadhaar. Then inform your gas distributor.',
    },
    'scholarship': {
      'hi': 'स्कॉलरशिप के लिए National Scholarship Portal (scholarships.gov.in) पर रजिस्टर करें। मार्कशीट, इनकम सर्टिफिकेट और बैंक डिटेल्स की जरूरत होगी।',
      'en': 'For scholarships, register on the National Scholarship Portal (scholarships.gov.in). You’ll need mark sheets, income certificate, and bank details.',
    },
    'default': {
      'hi': 'नमस्ते! मैं भारतGPT हूँ। आप मुझसे सरकारी योजनाओं, फॉर्म्स, या किसी भी सरकारी सेवा के बारे में पूछ सकते हैं।',
      'en': 'Hello! I am BharatGPT. You can ask me about government schemes, forms, or any government service.',
    },
  };

  const lang = language.startsWith('hi') ? 'hi' : 'en';
  let responseText = mockResponses.default[lang];
  for (const [key, value] of Object.entries(mockResponses)) {
    if (query.toLowerCase().includes(key) && key !== 'default') {
      responseText = value[lang];
      break;
    }
  }

  return {
    success: true,
    text: responseText,
    source: 'BharatGPT',
    timestamp: new Date().toISOString(),
    language,
  };
};


export const fillForm = async (formData, language = 'hi-IN') => {
  await delay(2000); 

  const formType = formData.get('formType');
  const lang = language.startsWith('hi') ? 'hi' : 'en';

  const formMessages = {
    'ration': { 'hi': 'आपका राशन कार्ड फॉर्म सफलतापूर्वक भरा गया!', 'en': 'Your Ration Card form has been auto-filled successfully!' },
    'passport': { 'hi': 'आपका पासपोर्ट आवेदन फॉर्म सफलतापूर्वक भरा गया!', 'en': 'Your Passport Application form has been auto-filled successfully!' },
    'voter': { 'hi': 'आपका वोटर ID फॉर्म सफलतापूर्वक भरा गया!', 'en': 'Your Voter ID form has been auto-filled successfully!' },
    'pan': { 'hi': 'आपका PAN कार्ड फॉर्म सफलतापूर्वक भरा गया!', 'en': 'Your PAN Card form has been auto-filled successfully!' },
    'ayushman': { 'hi': 'आपका आयुष्मान भारत फॉर्म सफलतापूर्वक भरा गया!', 'en': 'Your Ayushman Bharat form has been auto-filled successfully!' },
    'scholarship': { 'hi': 'आपका स्कॉलरशिप फॉर्म सफलतापूर्वक भरा गया!', 'en': 'Your Scholarship form has been auto-filled successfully!' },
  };

  if (!formType || !formMessages[formType]) {
    return {
      success: false,
      message: lang === 'hi' ? 'अमान्य फॉर्म प्रकार। कृपया फिर से प्रयास करें।' : 'Invalid form type. Please try again.',
      language,
    };
  }

  return {
    success: true,
    message: formMessages[formType][lang],
    downloadUrl: '#',
    formType,
    timestamp: new Date().toISOString(),
    language,
  };
};

export const getEmergencyAlerts = async (location, alertType, language = 'hi-IN') => {
  await delay(1500);

  const lang = language.startsWith('hi') ? 'hi' : 'en';
  const mockAlerts = {
    'hospital': [
      { name: { 'hi': 'AIIMS अस्पताल', 'en': 'AIIMS Hospital' }, availability: '15 बेड', contact: '011-2658-9876', address: 'अंसारी नगर, नई दिल्ली' },
      { name: { 'hi': 'सफदरजंग अस्पताल', 'en': 'Safdarjung Hospital' }, availability: '8 बेड', contact: '011-2673-1234', address: 'अंसारी नगर वेस्ट, नई दिल्ली' },
    ],
    'ambulance': [
      { name: { 'hi': '108 आपातकालीन सेवा', 'en': '108 Emergency Service' }, response_time: '10-15 मिनट', contact: '108', area: 'पूरे दिल्ली NCR' },
      { name: { 'hi': 'जय एम्बुलेंस', 'en': 'Jai Ambulance' }, response_time: '5-10 मिनट', contact: '9876543210', area: 'दक्षिण दिल्ली' },
    ],
    'oxygen': [
      { name: { 'hi': 'ऑक्सीजन बैंक दिल्ली', 'en': 'Oxygen Bank Delhi' }, availability: 'स्टॉक में', contact: '9988776655', address: 'लाजपत नगर, दिल्ली' },
      { name: { 'hi': 'मेडिकल सप्लाईज कंपनी', 'en': 'Medical Supplies Co.' }, availability: 'सीमित स्टॉक', contact: '9876123450', address: 'करोल बाग, दिल्ली' },
    ],
    'flood': [
      { area: { 'hi': 'यमुना खादर', 'en': 'Yamuna Khadar' }, status: 'उच्च सतर्कता', evacuation: 'सुझाव दिया गया', helpline: '1077' },
      { area: { 'hi': 'यमुना के निचले इलाके', 'en': 'Low-lying areas near Yamuna' }, status: 'चेतावनी', evacuation: 'तैयार रहें', helpline: '1077' },
    ],
    'cyclone': [
      { area: { 'hi': 'तटीय तमिलनाडु', 'en': 'Coastal Tamil Nadu' }, status: 'वर्तमान में कोई सतर्कता नहीं', last_updated: '2 दिन पहले' },
    ],
    'helpline': [
      { service: { 'hi': 'राष्ट्रीय आपातकालीन नंबर', 'en': 'National Emergency Number' }, number: '112', description: 'सभी आपातकालीन स्थिति' },
      { service: { 'hi': 'पुलिस', 'en': 'Police' }, number: '100', description: 'कानून और व्यवस्था आपातकाल' },
      { service: { 'hi': 'आग', 'en': 'Fire' }, number: '101', description: 'आग आपातकाल' },
      { service: { 'hi': 'एम्बुलेंस', 'en': 'Ambulance' }, number: '102', description: 'चिकित्सा आपातकाल' },
      { service: { 'hi': 'प्राकृतिक आपदा प्रबंधन', 'en': 'Disaster Management' }, number: '108', description: 'प्राकृतिक आपदाएँ' },
    ],
  };

  const alerts = mockAlerts[alertType] || [];
  return alerts.map(alert => ({
    ...alert,
    name: alert.name[lang] || alert.name,
    area: alert.area ? alert.area[lang] || alert.area : undefined,
    service: alert.service ? alert.service[lang] || alert.service : undefined,
    availability: alert.availability,
    contact: alert.contact,
    address: alert.address,
    response_time: alert.response_time,
    status: alert.status,
    evacuation: alert.evacuation,
    last_updated: alert.last_updated,
    helpline: alert.helpline,
    timestamp: new Date().toISOString(),
    language,
  }));
};


export const getSchemeInfo = async (scheme, language = 'hi-IN') => {
  await delay(1000); 

  const lang = language.startsWith('hi') ? 'hi' : 'en';
  const schemes = {
    'kisan': {
      name: { 'hi': 'पीएम किसान सम्मान निधि', 'en': 'PM Kisan Samman Nidhi' },
      description: { 'hi': 'सभी भूमिधारी किसान परिवारों को साल में 6000 रुपये की आय सहायता तीन बराबर किश्तों में।', 'en': 'Income support of Rs. 6,000 per year in three equal installments to all landholding farmer families.' },
      eligibility: { 'hi': '2 हेक्टेयर तक की खेती योग्य भूमि वाले सभी किसान।', 'en': 'All farmers with cultivable land up to 2 hectares.' },
      documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
      website: 'pmkisan.gov.in',
      helpline: '011-23381092',
    },
    'ujjwala': {
      name: { 'hi': 'प्रधानमंत्री उज्ज्वला योजना', 'en': 'Pradhan Mantri Ujjwala Yojana' },
      description: { 'hi': 'बीपीएल घरों की महिलाओं को सब्सिडी दरों पर एलपीजी कनेक्शन।', 'en': 'Provides LPG connections to women from Below Poverty Line (BPL) households at subsidized rates.' },
      eligibility: { 'hi': 'एलपीजी कनेक्शन न होने वाली बीपीएल घरों की महिलाएं।', 'en': 'Women from BPL households without an existing LPG connection.' },
      documents: ['Aadhaar Card', 'BPL Certificate', 'Bank Account Details'],
      website: 'pmuy.gov.in',
      helpline: '1800-266-6696',
    },
    'awas': {
      name: { 'hi': 'प्रधानमंत्री आवास योजना', 'en': 'Pradhan Mantri Awas Yojana' },
      description: { 'hi': '2022 तक सभी के लिए आवास - घर निर्माण के लिए वित्तीय सहायता।', 'en': 'Financial assistance for house construction targeting Economically Weaker Section (EWS) and Low Income Group (LIG).' },
      eligibility: { 'hi': 'वर्षीय आय 3 लाख तक (ईडब्ल्यूएस) या 6 लाख तक (एलआईजी)।', 'en': 'Annual income up to ₹3 lakh (EWS) or ₹6 lakh (LIG).' },
      documents: ['Aadhaar Card', 'Income Certificate', 'Land Documents'],
      website: 'pmaymis.gov.in',
      helpline: '1800-11-6163',
    },
  };

  const schemeKey = Object.keys(schemes).find((key) => scheme.toLowerCase().includes(key));

  if (schemeKey) {
    return {
      success: true,
      data: {
        ...schemes[schemeKey],
        name: schemes[schemeKey].name[lang],
        description: schemes[schemeKey].description[lang],
        eligibility: schemes[schemeKey].eligibility[lang],
      },
      timestamp: new Date().toISOString(),
      language,
    };
  }

  return {
    success: false,
    message: lang === 'hi' ? 'स्कीम की जानकारी नहीं मिली। कृपया अलग कीवर्ड से प्रयास करें।' : 'Scheme information not found. Please try with a different keyword.',
    timestamp: new Date().toISOString(),
    language,
  };
};


export const getPriceComparison = async (service, location, language = 'hi-IN') => {
  await delay(1200); 

  const lang = language.startsWith('hi') ? 'hi' : 'en';
  const priceData = {
    'lpg': [
      { provider: { 'hi': 'इंडेन गैस', 'en': 'Indane Gas' }, price: '₹900', location: 'लाजपत नगर, दिल्ली', contact: '1800-233-3555' },
      { provider: { 'hi': 'एचपी गैस', 'en': 'HP Gas' }, price: '₹910', location: 'करोल बाग, दिल्ली', contact: '1800-233-3388' },
      { provider: { 'hi': 'भारत गैस', 'en': 'Bharat Gas' }, price: '₹895', location: 'द्वारका, दिल्ली', contact: '1800-233-3555' },
    ],
    'petrol': [
      { provider: { 'hi': 'इंडियन ऑयल', 'en': 'Indian Oil' }, price: '₹96.72', location: 'कॉनॉट प्लेस, दिल्ली', contact: 'N/A' },
      { provider: { 'hi': 'भारत पेट्रोलियम', 'en': 'Bharat Petroleum' }, price: '₹96.57', location: 'जनकपुरी, दिल्ली', contact: 'N/A' },
      { provider: { 'hi': 'हिंदुस्तान पेट्रोलियम', 'en': 'Hindustan Petroleum' }, price: '₹96.68', location: 'मयूर विहार, दिल्ली', contact: 'N/A' },
    ],
    'medicine': [
      { provider: { 'hi': 'जन औषधि केंद्र', 'en': 'Jan Aushadhi Kendra' }, price: '₹50-70% सस्ता', location: 'AIIMS, दिल्ली', contact: '1800-180-8080' },
      { provider: { 'hi': 'अपोलो फार्मेसी', 'en': 'Apollo Pharmacy' }, price: 'मार्केट प्राइस', location: 'मल्टीपल लोकेशन', contact: '1860-500-0101' },
      { provider: { 'hi': 'जनरल मेडिकल स्टोर', 'en': 'Generic Medical Store' }, price: '₹30-50% सस्ता', location: 'करोल बाग, दिल्ली', contact: '9876543210' },
    ],
  };

  const serviceKey = Object.keys(priceData).find((key) => service.toLowerCase().includes(key));

  if (serviceKey) {
    return {
      success: true,
      data: priceData[serviceKey].map((item) => ({
        ...item,
        provider: item.provider[lang],
        location: item.location,
        price: item.price,
        contact: item.contact,
      })),
      service: serviceKey,
      timestamp: new Date().toISOString(),
      language,
    };
  }

  return {
    success: false,
    message: lang === 'hi' ? 'इस सेवा के लिए कीमत की जानकारी उपलब्ध नहीं है। हम वर्तमान में LPG, पेट्रोल, और दवा का समर्थन करते हैं।' : 'Price information not available for this service. We currently support LPG, petrol, and medicine.',
    data: [],
    timestamp: new Date().toISOString(),
    language,
  };
};