'use client';

import { useState, useEffect, useCallback } from 'react';

export default function useVoiceInput({ language = 'hi-IN', silenceTimeout = 3000 } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);
  const [lastSpeechTimestamp, setLastSpeechTimestamp] = useState(null);
  const [silenceTimer, setSilenceTimer] = useState(null);

  // Initialize SpeechRecognition with memoized callback
  const initializeRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use a modern browser like Chrome or Edge.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;
    recognitionInstance.maxAlternatives = 1;

    // Event Handlers
    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionInstance.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update transcript
      setTranscript((prev) => (finalTranscript || interimTranscript || prev).trim());
      
      // Reset silence detection on speech
      setLastSpeechTimestamp(Date.now());
      
      // Clear any existing silence timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      
      // Set a new silence timer
      const timer = setTimeout(() => {
        const now = Date.now();
        const lastSpeech = lastSpeechTimestamp;
        
        if (lastSpeech && (now - lastSpeech > silenceTimeout) && isListening) {
          console.log('Silence detected, stopping recognition');
          recognition.stop();
          setIsListening(false);
        }
      }, silenceTimeout);
      
      setSilenceTimer(timer);
    };

    recognitionInstance.onerror = (event) => {
      setIsListening(false);
      const errorMessage = `Speech recognition error: ${event.error} (${event.message || 'Unknown reason'})`;
      console.error(errorMessage);
      setError(errorMessage);
      if (event.error === 'not-allowed' || event.error === 'denied') {
        setError('Please allow microphone access to use voice input.');
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
  }, [language]);

  // Effect to set up recognition
  useEffect(() => {
    initializeRecognition();

    return () => {
      if (recognition) {
        recognition.stop();
        recognition.onend = null;
      }
      
      // Clear any silence detection timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, [initializeRecognition]);

  // Start Listening
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setError('Failed to start voice input. Please try again.');
      }
    }
  }, [recognition, isListening]);

  // Stop Listening
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          setSilenceTimer(null);
        }
        
        // Stop the recognition
        recognition.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Failed to stop recognition:', err);
        setError('Failed to stop voice input.');
      }
    }
  }, [recognition, isListening, silenceTimer]);

  // Reset Transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Toggle Listening 
  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    toggleListening,
    setLanguage: (newLang) => (recognition.lang = newLang), 
  };
}