// Simple in-memory rate limiter for API protection
const requests = new Map();

export function rateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get existing requests for this identifier
  const userRequests = requests.get(identifier) || [];
  
  // Filter out old requests outside the window
  const recentRequests = userRequests.filter(time => time > windowStart);
  
  // Check if limit exceeded
  if (recentRequests.length >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: Math.ceil((Math.min(...recentRequests) + windowMs) / 1000)
    };
  }
  
  // Add current request
  recentRequests.push(now);
  requests.set(identifier, recentRequests);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupOldEntries(windowMs);
  }
  
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - recentRequests.length,
    resetTime: Math.ceil((now + windowMs) / 1000)
  };
}

function cleanupOldEntries(windowMs) {
  const cutoff = Date.now() - windowMs;
  
  for (const [identifier, times] of requests.entries()) {
    const recentTimes = times.filter(time => time > cutoff);
    
    if (recentTimes.length === 0) {
      requests.delete(identifier);
    } else {
      requests.set(identifier, recentTimes);
    }
  }
}

export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || cfIP || 'unknown';
}
