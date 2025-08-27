'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { RiSendPlaneFill} from 'react-icons/ri';
import { useSession } from 'next-auth/react';
import useVoiceInput from '../hooks/useVoiceInput';
import Image from 'next/image';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [voiceError, setVoiceError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isListening, startListening, stopListening, transcript, error, resetTranscript } = useVoiceInput();
  
  // Sample suggestions for the input field
  const suggestions = [
    "What are the major festivals of India?",
    "Tell me about Indian classical music",
    "Explain the significance of the Taj Mahal",
    "What are popular Indian dishes?",
    "Tell me about India's space program"
  ];

  // User information
  const [username, setUsername] = useState('');
  const { data: session, status } = useSession();

  // Get user data from NextAuth session or localStorage
  useEffect(() => {
    // First check NextAuth session
    if (session?.user) {
      setUsername(session.user.name);
    } else if (status === 'loading') {
      // Still loading session, don't set Guest yet
      return;
    } else {
      // Fallback to localStorage for traditional auth
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUsername(parsedUser.name);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUsername('Guest');
        }
      } else {
        setUsername('Guest');
      }
    }
  }, [session, status]);
  
  // Chat related state
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'bot',
      content: `Good evening! नमस्ते!<br/><span class="text-gray-500">How can I help you today?</span>`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-rotate suggestions
  useEffect(() => {
    if (suggestions.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (transcript && isListening) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

  // Handle voice recognition errors
  useEffect(() => {
    if (error) {
      setVoiceError(error);
      const timer = setTimeout(() => setVoiceError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setQuery(transcript);
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Handle chat message submission
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/gpt4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      
      let botResponse = '';
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        
        const mainTitle = `<h2 class="text-2xl font-bold text-gray-900 mb-4">${result.title}</h2>`;
        
        let processedContent = result.content
          .replace(/(\d+)\.\s*\*\s*([^:*]+)(:\*\*|\*\*)/g, 
            '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1. $2</h3>')
          
          .replace(/\*\s*([^:*]+)(:\*\*|\*\*)/g, 
            '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h3>')
          .split('\n\n')
          .map(para => {
            if (para.startsWith('<h3')) {
              return para;
            }
            return `<p class="mb-4 text-gray-700 leading-relaxed">${para}</p>`;
          })
          .join('');
        
        processedContent = processedContent
          .replace(/<p class="[^"]+">(\d+)\.\s+([^<]+)<\/p>/g, 
            '<div class="mb-3 pl-4"><span class="font-semibold text-gray-800 mr-2">$1.</span>$2</div>');
        processedContent = processedContent
          .replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, 
            '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
        
        botResponse = `
          <div class="space-y-4">
            ${mainTitle}
            <div class="space-y-2">
              ${processedContent}
            </div>
            ${result.link ? 
              `<div class="mt-6 pt-4 border-t border-gray-200">
                <a href="${result.link}" target="_blank" rel="noopener noreferrer" 
                  class="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium">
                  <span>Official Website</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>` 
              : ''
            }
          </div>`;
      } else {
        botResponse = `
          <div>
            <p class="mb-2">I couldn't find specific information for your query. Could you please provide more details?</p>
          </div>`;
      }
      
      // Add bot response to chat
      const botMessage = {
        role: 'bot',
        content: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setQuery(''); 
    } catch (error) {
      console.error('Error fetching results:', error);
      
      // Add error message to chat
      const errorMessage = {
        role: 'bot',
        content: `
          <div>
            <p>Sorry, I couldn't process your request. Please try again later.</p>
          </div>`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FF9933" strokeWidth="2" opacity="0.3">
            <animate attributeName="r" from="40" to="50" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="30" r="20" fill="none" stroke="#138808" strokeWidth="1.5" opacity="0.3">
            <animate attributeName="r" from="20" to="25" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="70" r="25" fill="none" stroke="#000080" strokeWidth="1.5" opacity="0.2">
            <animate attributeName="r" from="25" to="30" dur="6s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      
      {/* Header */}
      <header className="border-b border-gray-200 py-2 px-4 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="h-15 w-15 rounded-full overflow-hidden">
            <Image
              src="/bg-logo.png"
              alt="BharatGPT Logo"
              width={90}
              height={90}
              priority
            />
          </div>
          <span className="font-medium text-lg">BharatGPT</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
            <span className="font-medium">{username ? username.charAt(0).toUpperCase() : 'G'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          {chatMessages.length === 1 && !isLoading ? (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-semibold text-gray-800 mb-2">
                {getGreeting()}, {username}.
              </h1>
              <p className="text-xl text-gray-500 mb-8">
                How can I help you today?
              </p>
            </div>
          ) : (
            <div className="w-full space-y-10 mb-6">
              {chatMessages.map((message, index) => (
                index !== 0 && (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-1 font-medium text-gray-800">
                      {message.role === 'user' ? 'You' : (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">
                            B
                          </div>
                          <span>BharatGPT</span>
                        </div>
                      )}
                    </div>
                    
                    {message.role === 'user' ? (
                      <div className="text-gray-800">
                        {message.content}
                      </div>
                    ) : (
                      <div 
                        className={`text-gray-800 ${message.isError ? 'text-red-600' : ''}`}
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    )}
                  </motion.div>
                )
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="mb-1 font-medium text-gray-800 flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">
                      B
                    </div>
                    <span>BharatGPT</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          
          {/* Input Area */}
          <div className="w-full mt-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white border border-gray-300 rounded-full overflow-hidden focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 shadow-md">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What do you want to know?"
                  className="flex-grow py-4 px-5 border-none focus:outline-none text-gray-800 placeholder-gray-500 text-lg"
                />
                <div className="flex items-center pr-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-full ${isListening ? 'text-red-500' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    {isListening ? <FaMicrophoneSlash className="text-xl" /> : <FaMicrophone className="text-xl" />}
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className={`p-2 rounded-full ${!query.trim() || isLoading ? 'text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}
                    whileHover={{ scale: query.trim() && !isLoading ? 1.1 : 1 }}
                    whileTap={{ scale: query.trim() && !isLoading ? 0.9 : 1 }}
                    disabled={isLoading || !query.trim()}
                  >
                    <RiSendPlaneFill className="text-xl rotate-90" />
                  </motion.button>
                </div>
              </div>
              {voiceError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-0 right-0 bg-red-500 text-white text-sm p-2 rounded-md z-10"
                >
                  {voiceError}
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}