interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * In-memory sliding window rate limiter for Server Action / API Route
 * @param ip Client IP address
 * @param limit Max allowed requests in window
 * @param windowMs Window duration in milliseconds (default 1 minute)
 */
export function rateLimit(ip: string, limit = 10, windowMs = 60000): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = store[ip];

  if (!record || now > record.resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(record.resetTime / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: Math.ceil(record.resetTime / 1000),
  };
}
