'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import useGeolocation from '@/hooks/useGeolocation';

export default function SurakshaSahayata() {
  const { data: session } = useSession();
  const { 
    location, 
    error: locationError, 
    loading: locationLoading, 
    getCurrentLocation,
    getAddressFromCoordinates,
    isSupported: geolocationSupported 
  } = useGeolocation();
  
  // State management
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [currentAddress, setCurrentAddress] = useState('');
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('emergency');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [alertData, setAlertData] = useState(null);
  
  // Contact form state
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  // Emergency types
  const emergencyTypes = [
    { 
      id: 'medical', 
      title: 'Medical Emergency', 
      icon: '🚑', 
      color: 'red',
      description: 'Health emergency requiring immediate medical attention'
    },
    { 
      id: 'police', 
      title: 'Police Emergency', 
      icon: '👮', 
      color: 'blue',
      description: 'Crime, threat, or law enforcement needed'
    },
    { 
      id: 'fire', 
      title: 'Fire Emergency', 
      icon: '🔥', 
      color: 'orange',
      description: 'Fire, gas leak, or hazardous situation'
    },
    { 
      id: 'personal', 
      title: 'Personal Safety', 
      icon: '🆘', 
      color: 'purple',
      description: 'Personal threat or safety concern'
    },
    { 
      id: 'accident', 
      title: 'Accident', 
      icon: '🚗', 
      color: 'yellow',
      description: 'Vehicle accident or injury'
    },
    { 
      id: 'general', 
      title: 'General Emergency', 
      icon: '⚠️', 
      color: 'gray',
      description: 'Other emergency situation'
    }
  ];

  // Official emergency numbers
  const officialNumbers = [
    { name: 'Police', number: '100', icon: '👮', description: 'For crime and law enforcement' },
    { name: 'Fire Brigade', number: '101', icon: '🔥', description: 'Fire and rescue services' },
    { name: 'Ambulance', number: '108', icon: '🚑', description: 'Medical emergency services' },
    { name: 'National Emergency', number: '112', icon: '🆘', description: 'All-in-one emergency number' },
    { name: 'Women Helpline', number: '1090', icon: '👩', description: 'Women safety and support' },
    { name: 'Child Helpline', number: '1098', icon: '👶', description: 'Child protection services' },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const slideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Load emergency contacts and location on component mount
  useEffect(() => {
    if (session?.user) {
      loadEmergencyContacts();
    }
    // Always try to get location, regardless of login status
    getCurrentLocation();
  }, [session, getCurrentLocation, loadEmergencyContacts]);

  // Get address when location changes
  useEffect(() => {
    if (location) {
      getAddressFromCoordinates(location.latitude, location.longitude)
        .then((address) => {
          setCurrentAddress(address);
        })
        .catch(() => {
          setCurrentAddress(`${location.latitude}, ${location.longitude}`);
        });
    }
  }, [location, getAddressFromCoordinates]);

  // Helper functions
  const getAuthHeaders = useCallback(() => {
    // Try to get token from localStorage first, then from session
    let token = null;
    
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    
    // If no token in localStorage, try to get from NextAuth session
    if (!token && session?.accessToken) {
      token = session.accessToken;
    }
    
    if (!token) {
      return {
        'Content-Type': 'application/json'
      };
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, [session?.accessToken]);

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 5000);
  };

  // Emergency contacts management
  const loadEmergencyContacts = useCallback(async () => {
    try {
      setIsLoadingContacts(true);
      const response = await fetch('/api/emergency-contacts', {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmergencyContacts(data.contacts || []);
      } else {
        showMessage('Failed to load emergency contacts', 'error');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      showMessage('Failed to load emergency contacts', 'error');
    } finally {
      setIsLoadingContacts(false);
    }
  }, [getAuthHeaders]);

  const addEmergencyContact = async (e) => {
    e.preventDefault();
    
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      showMessage('Name and phone are required', 'error');
      return;
    }

    try {
      const response = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newContact)
      });

      if (response.ok) {
        showMessage('Emergency contact added successfully');
        setNewContact({ name: '', phone: '', relationship: '' });
        setShowContactForm(false);
        loadEmergencyContacts();
      } else {
        const data = await response.json();
        showMessage(data.error || 'Failed to add contact', 'error');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      showMessage('Failed to add emergency contact', 'error');
    }
  };

  const deleteEmergencyContact = async (contactId) => {
    try {
      const response = await fetch(`/api/emergency-contacts?id=${contactId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        showMessage('Contact deleted successfully');
        loadEmergencyContacts();
      } else {
        showMessage('Failed to delete contact', 'error');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      showMessage('Failed to delete contact', 'error');
    }
  };

  // Emergency alert functions
  const handleEmergencyClick = (type) => {
    if (!session?.user) {
      showMessage('Please log in to send emergency alerts', 'error');
      return;
    }

    if (!location) {
      showMessage('Getting your location first...', 'error');
      getCurrentLocation();
      return;
    }

    setEmergencyType(type);
    setShowEmergencyModal(true);
  };

  const sendEmergencyAlert = async () => {
    if (!session?.user) {
      showMessage('Please log in to send emergency alerts', 'error');
      return;
    }

    if (!location || emergencyContacts.length === 0) {
      showMessage('Location and emergency contacts are required', 'error');
      return;
    }

    try {
      setShowEmergencyModal(false);
      
      const headers = getAuthHeaders();
      
      const requestBody = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: currentAddress,
        emergencyType: emergencyType,
        message: `🚨 ${emergencyTypes.find(t => t.id === emergencyType)?.title || 'EMERGENCY'} ALERT 🚨`
      };
      
      const response = await fetch('/api/emergency-alert', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const data = await response.json();
        setAlertData(data);
        showMessage('Emergency alert prepared successfully!');
      } else {
        const errorData = await response.json();
        showMessage(errorData.error || `Failed to prepare emergency alert (${response.status})`, 'error');
      }
    } catch (error) {
      showMessage(`Failed to send emergency alert: ${error.message}`, 'error');
    }
  };

  const callEmergencyNumber = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <div className="w-full h-2 flex">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div> 
        <div className="w-1/3 bg-[#138808]"></div> 
      </div>
      
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mr-4 shadow-lg animate-pulse">
              🚨
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                <span className="text-[#FF9933]">Suraksha</span>{' '}
                <span className="text-[#138808]">Sahayata</span>
              </h1>
              <p className="text-gray-600 text-sm">(सुरक्षा सहायता - Emergency Response System)</p>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
            >
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"
            >
              <p className="text-green-700">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-md p-2">
          {[
            { id: 'emergency', label: 'Emergency Alert', icon: '🚨' },
            { id: 'contacts', label: 'My Contacts', icon: '👥' },
            { id: 'numbers', label: 'Official Numbers', icon: '📞' },
            { id: 'location', label: 'Location', icon: '📍' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 m-1 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Emergency Alert Tab */}
          {activeTab === 'emergency' && (
            <motion.div
              key="emergency"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Emergency Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                  🚨 Quick Emergency Actions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emergencyTypes.map((emergency, index) => (
                    <motion.button
                      key={emergency.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleEmergencyClick(emergency.id)}
                      className={`p-6 rounded-xl border-2 border-${emergency.color}-200 bg-${emergency.color}-50 hover:bg-${emergency.color}-100 hover:border-${emergency.color}-300 transition-all duration-300 transform hover:scale-105 group`}
                      disabled={!session?.user || !location || emergencyContacts.length === 0}
                    >
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {emergency.icon}
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {emergency.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {emergency.description}
                      </p>
                    </motion.button>
                  ))}
                </div>

                {/* Status indicators */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">System Status:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${session?.user ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>{session?.user ? '✅ Logged In' : '❌ Not Logged In'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${location ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>{location ? '✅ Location Available' : '❌ Location Needed'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${emergencyContacts.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>{emergencyContacts.length > 0 ? `✅ ${emergencyContacts.length} Contacts` : '❌ No Contacts'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === 'contacts' && (
            <motion.div
              key="contacts"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideIn}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  👥 Emergency Contacts ({emergencyContacts.length}/5)
                </h2>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                  disabled={emergencyContacts.length >= 5}
                >
                  {showContactForm ? 'Cancel' : '+ Add Contact'}
                </button>
              </div>

              {/* Add Contact Form */}
              <AnimatePresence>
                {showContactForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={addEmergencyContact}
                    className="bg-blue-50 p-6 rounded-lg mb-6"
                  >
                    <h3 className="font-semibold text-gray-800 mb-4">Add New Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <select
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      >
                        <option value="">Select Relationship</option>
                        <option value="Family">Family</option>
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Neighbor">Neighbor</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                      >
                        Add Contact
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Contacts List */}
              {isLoadingContacts ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading contacts...</p>
                </div>
              ) : emergencyContacts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-gray-600">No emergency contacts added yet.</p>
                  <p className="text-sm text-gray-500">Add contacts to enable emergency alerts.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyContacts.map((contact, index) => (
                    <motion.div
                      key={contact._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-lg">{contact.name}</h4>
                          <p className="text-blue-600 font-medium">{contact.phone}</p>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                            {contact.relationship || 'Contact'}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteEmergencyContact(contact._id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-300"
                          title="Delete contact"
                        >
                          🗑️
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Official Numbers Tab */}
          {activeTab === 'numbers' && (
            <motion.div
              key="numbers"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideIn}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📞 Official Emergency Numbers
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {officialNumbers.map((number, index) => (
                  <motion.button
                    key={number.number}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => callEmergencyNumber(number.number)}
                    className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl hover:from-red-100 hover:to-red-200 hover:border-red-300 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {number.icon}
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 mb-2">{number.name}</h3>
                    <div className="text-3xl font-bold text-red-600 mb-2">{number.number}</div>
                    <p className="text-sm text-gray-600">{number.description}</p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>📱 Note:</strong> Tap any number to call directly. These are official Indian emergency numbers available 24/7.
                </p>
              </div>
            </motion.div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <motion.div
              key="location"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideIn}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📍 Location Services
              </h2>

              <div className="text-center">
                {!location ? (
                  <div className="py-8">
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Location</h3>
                    <p className="text-gray-600 mb-6">
                      Location sharing is required for emergency alerts to include your precise location.
                    </p>
                    
                    <button
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                        locationLoading
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                      }`}
                    >
                      {locationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                          Getting Location...
                        </>
                      ) : (
                        <>📍 Share My Location</>
                      )}
                    </button>

                    {locationError && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">❌ {locationError}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <div className="text-4xl mb-3">✅</div>
                      <h3 className="text-xl font-semibold text-green-800 mb-4">Location Shared Successfully</h3>
                      
                      <div className="text-left bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-800 mb-3">📍 Current Location Details:</h4>
                        
                        <div className="space-y-2 mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Address:</span>
                            <p className="text-gray-800">{currentAddress || 'Resolving address...'}</p>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-600">GPS Coordinates:</span>
                            <p className="text-gray-800 font-mono text-sm">
                              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-600">Accuracy:</span>
                            <p className="text-gray-800">±{Math.round(location.accuracy || 0)} meters</p>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                            <p className="text-gray-800 text-sm">
                              {new Date(location.timestamp).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm"
                          >
                            🗺️ View on Maps
                          </a>
                          
                          <a
                            href={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm"
                          >
                            📍 Get Directions
                          </a>
                          
                          <button
                            onClick={getCurrentLocation}
                            disabled={locationLoading}
                            className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                              locationLoading 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-orange-600 text-white hover:bg-orange-700'
                            }`}
                          >
                            {locationLoading ? '🔄 Updating...' : '🔄 Refresh Location'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Coordinates: {location.latitude}, {location.longitude}</p>
                      <p>Accuracy: ~{location.accuracy ? Math.round(location.accuracy) : 'Unknown'} meters</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency Confirmation Modal */}
        <AnimatePresence>
          {showEmergencyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEmergencyModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {emergencyTypes.find(t => t.id === emergencyType)?.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-red-600 mb-4">
                    Confirm Emergency Alert
                  </h3>
                  <p className="text-gray-700 mb-2">
                    You are about to send a <strong>{emergencyTypes.find(t => t.id === emergencyType)?.title}</strong> alert.
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    This will prepare messages for {emergencyContacts.length} emergency contact(s) with your current location.
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={sendEmergencyAlert}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold"
                    >
                      🚨 Send Alert
                    </button>
                    <button
                      onClick={() => setShowEmergencyModal(false)}
                      className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert Success Modal */}
        <AnimatePresence>
          {alertData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setAlertData(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🚨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Emergency Alert Ready!</h3>
                  <p className="text-gray-600">
                    Alert prepared for {alertData.contactsCount} contact(s)
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-800 mb-3">📍 Emergency Location Details:</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-sm font-medium text-red-700">Address:</span>
                      <p className="text-red-800">{alertData.location?.address || 'Address not available'}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-red-700">GPS Coordinates:</span>
                      <p className="text-red-800 font-mono text-sm">
                        {alertData.location?.latitude}, {alertData.location?.longitude}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-red-700">Location Accuracy:</span>
                      <p className="text-red-800">Within 50 meters</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <a 
                      href={alertData.location?.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm"
                    >
                      🗺️ View on Maps
                    </a>
                    
                    <a 
                      href={`https://maps.google.com/maps?q=${alertData.location?.latitude},${alertData.location?.longitude}&z=15`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm"
                    >
                      📍 Get Directions
                    </a>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-800 text-center text-lg">
                    Send Alert to Your Contacts:
                  </h4>
                  
                  {alertData.alertMethods?.map((method, index) => (
                    <div key={`alert-${index}-${method.name}`} className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="mb-3">
                        <h5 className="font-semibold text-gray-800 text-lg">
                          👤 {method.name}
                        </h5>
                        <p className="text-gray-600 text-sm">
                          {method.relationship} • {method.phone}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <a
                          href={method.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium w-full"
                        >
                          <span className="mr-2">💬</span>
                          Send WhatsApp Message
                        </a>
                        
                        <a
                          href={method.smsUrl}
                          className="flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium w-full"
                        >
                          <span className="mr-2">📱</span>
                          Send SMS
                        </a>
                        

                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>💡 How it works:</strong> Click the buttons above to open your messaging apps with pre-filled emergency messages including your location and emergency details.
                  </p>
                </div>
                
                <button
                  onClick={() => setAlertData(null)}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300 font-semibold"
                >
                  Close Alert Panel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <div className="w-full h-2 flex">
        <div className="w-1/3 bg-[#FF9933]"></div> 
        <div className="w-1/3 bg-white"></div> 
        <div className="w-1/3 bg-[#138808]"></div> 
      </div>
    </div>
  );
}
