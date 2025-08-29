import { useState, useCallback } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Unknown error occurred';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = err.message;
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, []);

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return null;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        });
        setError(null);
      },
      (err) => {
        let errorMessage = 'Unknown error occurred';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = err.message;
            break;
        }
        
        setError(errorMessage);
      },
      options
    );

    return watchId;
  }, []);

  const clearWatch = useCallback((watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const getAddressFromCoordinates = useCallback(async (lat, lng) => {
    try {
      // Using a free geocoding service (you could also use Google Maps API if you have a key)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      return data.displayName || `${lat}, ${lng}`;
    } catch (error) {
      console.error('Error getting address:', error);
      return `${lat}, ${lng}`;
    }
  }, []);

  return {
    location,
    error,
    loading,
    getCurrentLocation,
    watchLocation,
    clearWatch,
    getAddressFromCoordinates,
    isSupported: 'geolocation' in navigator
  };
}
