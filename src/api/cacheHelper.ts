import axios, { AxiosInstance } from "axios";

// Create an Axios instance
export const https: AxiosInstance = axios.create({
  baseURL: "https://b7concepts.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Allow sending credentials (cookies)
  timeout: 100000,
});

// Define a type for our cache entries
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// Cache Map to store API responses
const apiCache = new Map<string, CacheEntry<any>>();

// Request interceptor for dynamic headers
https.interceptors.request.use((config) => {
  const sessionid = localStorage.getItem("sessionid");

  if (sessionid) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${sessionid}`;
  }

  return config;
});

// Function to generate a unique cache key.
// If your endpoint includes an id (or any parameter), it will be part of the key.
const generateCacheKey = (
  url: string,
  params?: Record<string, any>
): string => {
  const paramsString = params ? JSON.stringify(params) : "";
  return `${url}|${paramsString}`;
};

// Main cache-aware API helper function
export const cacheAPI = async <T>(
  fn: (url: string, params?: Record<string, any>) => Promise<T>,
  url: string,
  params?: Record<string, any>,
  cacheDuration = 300000 // Default cache duration: 5 minutes
): Promise<T> => {
  const cacheKey = generateCacheKey(url, params);
  const cached = apiCache.get(cacheKey);

  if (cached && cached.expiry > Date.now()) {
    console.log(`[CACHE HIT]: Serving cached data for key: ${cacheKey}`);
    return cached.data;
  }

  console.log(`[CACHE MISS]: Fetching fresh data for key: ${cacheKey}`);
  try {
    const data = await fn(url, params);
    apiCache.set(cacheKey, { data, expiry: Date.now() + cacheDuration });
    return data;
  } catch (error) {
    console.error(
      `[CACHE ERROR]: Failed to fetch data for key: ${cacheKey}`,
      error
    );
    throw error;
  }
};

// Periodic cache cleanup to remove expired entries
export const startCacheCleanup = (interval = 60000) => {
  setInterval(() => {
    const now = Date.now();
    for (const [key, { expiry }] of apiCache.entries()) {
      if (expiry < now) {
        apiCache.delete(key);
        console.log(`[CACHE CLEANUP]: Removed expired cache for key: ${key}`);
      }
    }
  }, interval);
};

// Initialize periodic cache cleanup
startCacheCleanup();
