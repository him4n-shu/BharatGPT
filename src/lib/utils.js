// Utility functions for various tasks
export function formatDate(dateString, locale = 'en-IN') {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error('Invalid date');

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
}


export function formatPhoneNumber(phoneNumber) {
  try {
    const cleaned = (phoneNumber || '').replace(/\D/g, '');
    if (!cleaned) return phoneNumber;

    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`; 
    } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `0${cleaned.slice(1, 6)}-${cleaned.slice(6)}`; 
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+91-${cleaned.slice(2, 7)}-${cleaned.slice(7)}`; 
    }

    return phoneNumber; 
  } catch (error) {
    console.error('Phone number formatting error:', error);
    return phoneNumber;
  }
}


export function truncateText(text, length = 100, preserveWords = false) {
  if (!text || text.length <= length) return text;

  if (preserveWords) {
    const words = text.trim().split(' ');
    let truncated = '';
    for (let word of words) {
      if ((truncated + word).length <= length) {
        truncated += (truncated ? ' ' : '') + word;
      } else {
        break;
      }
    }
    return truncated + (truncated.length < text.length ? '...' : '');
  }

  return text.slice(0, length) + '...';
}


export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}


export function containsHindi(text) {
  return /[\u0900-\u097F]/.test(text || '');
}


export function detectLanguage(text) {
  if (!text) return 'en';

  if (containsHindi(text)) return 'hi';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; 
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; 
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; 
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; 
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; 
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; 

  return 'en'; 
}


export function formatCurrency(amount, inHindi = false) {
  try {
    if (isNaN(amount) || amount < 0) throw new Error('Invalid amount');

    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });

    let formatted = formatter.format(amount);

    if (inHindi) {
      const hindiNumerals = {
        '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
        '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
      };
      formatted = formatted.replace(/[0-9]/g, (match) => hindiNumerals[match]);
    }

    return formatted;
  } catch (error) {
    console.error('Currency formatting error:', error);
    return '₹0';
  }
}


export function getGreeting(locale = 'hi') {
  const hour = new Date().getHours();
  const greetings = {
    hi: {
      morning: 'सुप्रभात',
      afternoon: 'नमस्ते',
      evening: 'शुभ संध्या',
    },
    en: {
      morning: 'Good Morning',
      afternoon: 'Hello',
      evening: 'Good Evening',
    },
  };

  const lang = locale === 'hi' ? 'hi' : 'en';
  if (hour < 12) return greetings[lang].morning;
  if (hour < 17) return greetings[lang].afternoon;
  return greetings[lang].evening;
}


export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}


export async function getUserLocation() {
  try {
    const mockLocation = 'New Delhi';
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockLocation;
  } catch (error) {
    console.error('Location fetch error:', error);
    return 'Unknown Location';
  }
}