interface ThrottleConfig {
  lookup: {
    rps: number;
    delay: number;
  };
  default: {
    rps: number;
    delay: number;
  };
}

const throttleConfig: ThrottleConfig = {
  lookup: {
    rps: 15,
    delay: Math.ceil(1000 / 15), // ~67ms between requests
  },
  default: {
    rps: 8,
    delay: Math.ceil(1000 / 8), // 125ms between requests
  },
};

// Simple delay function
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));

// Track last request times
let lastDefaultRequest = 0;
let lastLookupRequest = 0;

export class Throttle {
  static async check(type: 'lookup' | 'default' = 'default'): Promise<void> {
    const now = Date.now();
    const config = throttleConfig[type];
    
    if (type === 'lookup') {
      const timeSinceLastRequest = now - lastLookupRequest;
      const waitTime = config.delay - timeSinceLastRequest;
      
      if (waitTime > 0) {
        await delay(waitTime);
      }
      
      lastLookupRequest = Date.now();
    } else {
      const timeSinceLastRequest = now - lastDefaultRequest;
      const waitTime = config.delay - timeSinceLastRequest;
      
      if (waitTime > 0) {
        await delay(waitTime);
      }
      
      lastDefaultRequest = Date.now();
    }
  }
}