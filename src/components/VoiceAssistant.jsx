'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useVoiceInput from '../hooks/useVoiceInput';

export default function VoiceAssistant() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isListening, startListening, stopListening, transcript, resetTranscript } = useVoiceInput();

  const description = 'Ask questions about government processes, certificates, and schemes in your language.'; // Hardcoded description

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      setQuery(transcript);
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      setTimeout(() => {
        const mockResponses = {
          'certificate': '10th certificate ka duplicate banane ke liye aapko CBSE ki official website pe jana hoga. Yahan steps hain: 1. cbse.gov.in pe jaiye 2. Duplicate Certificate section pe click karein 3. Form download karke bharein 4. 500 rupees ka demand draft banvaiye 5. Regional office mein submit karein',
          'ration': 'Ration card ke liye aapko nearest PDS office jana hoga. Form No. 23 bharke, Aadhaar card, residence proof aur family photo ke saath submit karein.',
          'kisan': 'Kisan Credit Card ke liye aapko apne nearest bank branch mein jaana hoga. Aapko land records, identity proof aur address proof ki zaroorat padegi.',
          'default': 'Namaste! Main BharatGPT hoon. Aap mujhse sarkari yojanaon, forms, ya kisi bhi government service ke baare mein puch sakte hain.',
        };

        let responseText = mockResponses.default;
        for (const [key, value] of Object.entries(mockResponses)) {
          if (query.toLowerCase().includes(key) && key !== 'default') {
            responseText = value;
            break;
          }
        }

        setResponse(responseText);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting response:', error);
      setResponse('Maaf kijiye, kuch technical problem hai. Baad mein try karein.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 h-full flex flex-col"
    >
      <div className="w-12 h-12 bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full flex items-center justify-center text-white text-2xl mb-4 animate-pulse">
        🎤
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">Sarkari Babu Mode</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="relative mb-4">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={isListening ? transcript : query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="10th certificate ka duplicate kaise banaye?"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF9933]"
          />
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleVoiceInput}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500' : 'bg-[#FF9933]'} text-white`}
          >
            {isListening ? '⏹️' : '🎤'}
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full px-4 py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-medium rounded-lg hover:bg-opacity-90 transition-all disabled:bg-opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Ask BharatGPT'}
        </motion.button>
      </form>

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gray-50 rounded-xl border border-[#138808]"
        >
          <h4 className="font-bold mb-2 text-[#138808]">BharatGPT Response:</h4>
          <p className="text-gray-700">{response}</p>
        </motion.div>
      )}
    </motion.div>
  );
}