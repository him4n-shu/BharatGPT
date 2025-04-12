'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AutoFormFiller() {
  const [file, setFile] = useState(null);
  const [formType, setFormType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const description = 'Upload your Aadhaar card and let BharatGPT automatically fill government forms for you.';
  const formTypes = [
    { id: 'ration', name: 'Ration Card' },
    { id: 'passport', name: 'Passport Application' },
    { id: 'voter', name: 'Voter ID' },
    { id: 'pan', name: 'PAN Card' },
    { id: 'ayushman', name: 'Ayushman Bharat' },
    { id: 'scholarship', name: 'Scholarship Form' },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !formType) return;

    setIsLoading(true);
    setResult(null);

    try {
      setTimeout(() => {
        setResult({
          success: true,
          message: `Your ${formTypes.find(f => f.id === formType).name} form has been auto-filled successfully!`,
          downloadUrl: '#',
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error filling form:', error);
      setResult({
        success: false,
        message: 'Failed to process your document. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 h-full flex flex-col"
    >
      <div className="w-12 h-12 bg-gradient-to-r from-[#138808] to-[#8BC34A] rounded-full flex items-center justify-center text-white text-2xl mb-4 animate-bounce">
        📝
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">Auto-Form Filler</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Form Type</label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#138808]"
            required
          >
            <option value="">Select a form</option>
            {formTypes.map((form) => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload Aadhaar Card (Image/PDF)</label>
          <motion.div
            whileHover={{ scale: 1.02, borderColor: '#138808' }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#138808] transition-all"
          >
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="aadhaar-upload"
              required
            />
            <label
              htmlFor="aadhaar-upload"
              className="cursor-pointer block w-full text-gray-700"
            >
              {file ? (
                <span className="text-[#138808] font-medium">{file.name}</span>
              ) : (
                <span className="text-[#FF9933] font-medium">Click to upload</span>
              )}
            </label>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !file || !formType}
          className="w-full px-4 py-3 bg-gradient-to-r from-[#138808] to-[#8BC34A] text-white font-medium rounded-lg hover:bg-opacity-90 transition-all disabled:bg-opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Auto-Fill Form'}
        </motion.button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}
          >
            <p className={result.success ? 'text-[#138808]' : 'text-red-600'}>{result.message}</p>
            {result.success && result.downloadUrl && (
              <a
                href={result.downloadUrl}
                className="mt-2 inline-block px-4 py-2 bg-[#138808] text-white rounded-lg text-sm hover:bg-opacity-90"
              >
                Download Filled Form
              </a>
            )}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}