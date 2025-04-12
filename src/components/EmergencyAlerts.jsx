'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getEmergencyAlerts } from '../services/api';

export default function EmergencyAlerts() {
  const [location, setLocation] = useState('');
  const [alertType, setAlertType] = useState('hospital');
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState(null);
  const [error, setError] = useState(null);

  const alertTypes = [
    { id: 'hospital', name: 'Hospital Beds' },
    { id: 'ambulance', name: 'Ambulance Services' },
    { id: 'oxygen', name: 'Oxygen Suppliers' },
    { id: 'flood', name: 'Flood Warnings' },
    { id: 'cyclone', name: 'Cyclone Alerts' },
    { id: 'helpline', name: 'Emergency Helplines' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      setError('Please enter a location');
      return;
    }

    setIsLoading(true);
    setAlerts(null);
    setError(null);

    try {
      const alertsData = await getEmergencyAlerts(location, alertType);
      setAlerts(alertsData);
    } catch (err) {
      console.error('Error fetching emergency alerts:', err);
      setError('Failed to fetch emergency alerts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render alert items based on type
  const renderAlertItems = () => {
    if (!alerts || alerts.length === 0) {
      return <p className="text-gray-500 italic">No alerts found for this location.</p>;
    }

    switch (alertType) {
      case 'hospital':
        return alerts.map((alert, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3 card-hover-effect">
            <h3 className="font-semibold text-lg">{alert.name}</h3>
            <p><span className="font-medium">Availability:</span> {alert.availability}</p>
            <p><span className="font-medium">Contact:</span> {alert.contact}</p>
            <p><span className="font-medium">Address:</span> {alert.address}</p>
          </div>
        ));
      case 'ambulance':
        return alerts.map((alert, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3 card-hover-effect">
            <h3 className="font-semibold text-lg">{alert.name}</h3>
            <p><span className="font-medium">Response Time:</span> {alert.response_time}</p>
            <p><span className="font-medium">Contact:</span> {alert.contact}</p>
            <p><span className="font-medium">Area:</span> {alert.area}</p>
          </div>
        ));
      case 'oxygen':
        return alerts.map((alert, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3 card-hover-effect">
            <h3 className="font-semibold text-lg">{alert.name}</h3>
            <p><span className="font-medium">Availability:</span> {alert.availability}</p>
            <p><span className="font-medium">Contact:</span> {alert.contact}</p>
            <p><span className="font-medium">Address:</span> {alert.address}</p>
          </div>
        ));
      case 'flood':
        return alerts.map((alert, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3 card-hover-effect">
            <h3 className="font-semibold text-lg">{alert.area}</h3>
            <p><span className="font-medium">Status:</span> {alert.status}</p>
            <p><span className="font-medium">Evacuation:</span> {alert.evacuation}</p>
            <p><span className="font-medium">Helpline:</span> {alert.helpline}</p>
          </div>
        ));
      case 'cyclone':
        return alerts.map((alert, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3 card-hover-effect">
            <h3 className="font-semibold text-lg">{alert.area}</h3>
            <p><span className="font-medium">Status:</span> {alert.status}</p>
            <p><span className="font-medium">Last Updated:</span> {alert.last_updated}</p>
          </div>
        ));
      case 'helpline':
        return alerts.map((alert, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3 card-hover-effect">
            <h3 className="font-semibold text-lg">{alert.service}</h3>
            <p><span className="font-medium">Number:</span> <a href={`tel:${alert.number}`} className="text-blue-600 hover:underline">{alert.number}</a></p>
            <p><span className="font-medium">Description:</span> {alert.description}</p>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4"
    >
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#1E88E5] to-[#90CAF9] bg-clip-text text-transparent">
        Emergency Alerts & Services
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 mb-1">Your Location</label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city or area"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="alertType" className="block text-gray-700 mb-1">Emergency Service Type</label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            id="alertType"
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]"
          >
            {alertTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </motion.select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-[#E53935] to-[#EF9A9A] text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Find Emergency Services'}
        </motion.button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
        >
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <motion.div className="shimmer w-full h-32 rounded-lg" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
        </div>
      )}

      {alerts && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#1E88E5] to-[#90CAF9] bg-clip-text text-transparent">
            {alertTypes.find((type) => type.id === alertType)?.name} near {location}
          </h3>
          <div className="space-y-4">
            {renderAlertItems()}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}