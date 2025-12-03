import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Simple in-memory and persistent cache for API responses
 * Helps reduce API calls and improve performance
 */

const CACHE_PREFIX = '@api_cache_';
const DEFAULT_TTL = 3600000; // 1 hour in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// In-memory cache for faster access
const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * Generate cache key from params
 */
const generateCacheKey = (endpoint: string, params: any): string => {
  const paramString = JSON.stringify(params);
  return `${CACHE_PREFIX}${endpoint}_${paramString}`;
};

/**
 * Set cache entry
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds
 * @param persistent - Save to AsyncStorage for persistence
 */
export const setCache = async <T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL,
  persistent: boolean = false,
): Promise<void> => {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  };

  // Set in memory
  memoryCache.set(key, entry);

  // Optionally persist to AsyncStorage
  if (persistent) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Error saving to persistent cache:', error);
    }
  }
};

/**
 * Get cache entry
 * @param key - Cache key
 * @param checkPersistent - Check AsyncStorage if not in memory
 * @returns Cached data or null if not found/expired
 */
export const getCache = async <T>(
  key: string,
  checkPersistent: boolean = false,
): Promise<T | null> => {
  // Check memory cache first
  const memEntry = memoryCache.get(key);
  if (memEntry) {
    if (isCacheValid(memEntry)) {
      return memEntry.data as T;
    } else {
      // Remove expired entry
      memoryCache.delete(key);
    }
  }

  // Check persistent cache if enabled
  if (checkPersistent) {
    try {
      const persistentData = await AsyncStorage.getItem(key);
      if (persistentData) {
        const entry: CacheEntry<T> = JSON.parse(persistentData);
        if (isCacheValid(entry)) {
          // Restore to memory cache
          memoryCache.set(key, entry);
          return entry.data;
        } else {
          // Remove expired entry
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error reading from persistent cache:', error);
    }
  }

  return null;
};

/**
 * Check if cache entry is still valid
 */
const isCacheValid = (entry: CacheEntry<any>): boolean => {
  const now = Date.now();
  return now - entry.timestamp < entry.ttl;
};

/**
 * Clear specific cache entry
 */
export const clearCache = async (key: string): Promise<void> => {
  memoryCache.delete(key);
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all cache entries
 */
export const clearAllCache = async (): Promise<void> => {
  memoryCache.clear();
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

/**
 * Get or set cache with a callback
 * If cache exists and valid, return it. Otherwise, execute callback and cache result.
 *
 * @param key - Cache key
 * @param callback - Function to execute if cache miss
 * @param ttl - Time to live
 * @param persistent - Save to AsyncStorage
 */
export const getCachedOrFetch = async <T>(
  key: string,
  callback: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
  persistent: boolean = false,
): Promise<T> => {
  // Try to get from cache
  const cached = await getCache<T>(key, persistent);
  if (cached !== null) {
    console.log('Cache hit:', key);
    return cached;
  }

  // Cache miss - fetch data
  console.log('Cache miss:', key);
  const data = await callback();

  // Cache the result
  await setCache(key, data, ttl, persistent);

  return data;
};

/**
 * Cache wrapper for API responses
 * Usage: const result = await cacheApiCall('identify', params, () => apiCall(params))
 */
export const cacheApiCall = async <T>(
  endpoint: string,
  params: any,
  apiCall: () => Promise<T>,
  options: {
    ttl?: number;
    persistent?: boolean;
    skipCache?: boolean;
  } = {},
): Promise<T> => {
  const {ttl = DEFAULT_TTL, persistent = false, skipCache = false} = options;

  if (skipCache) {
    return await apiCall();
  }

  const cacheKey = generateCacheKey(endpoint, params);
  return await getCachedOrFetch(cacheKey, apiCall, ttl, persistent);
};

export default {
  setCache,
  getCache,
  clearCache,
  clearAllCache,
  getCachedOrFetch,
  cacheApiCall,
  generateCacheKey,
};
