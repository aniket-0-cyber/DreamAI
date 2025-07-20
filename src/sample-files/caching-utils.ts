/**
 * Caching utility for the DreamAI application.
 * Provides an in-memory cache with TTL (time-to-live) and size limits.
 */

export interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds for all entries
  maxSize?: number; // Maximum number of entries in the cache
}

export interface CacheEntry<T> {
  value: T;
  expires: number; // Timestamp when the entry expires
}

/**
 * An in-memory cache implementation.
 * Uses a Map for O(1) average time complexity for get, set, and delete.
 */
export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 60 * 1000, // Default 1 minute
      maxSize: options.maxSize || 100,
    };
  }

  /**
   * Retrieves a value from the cache.
   * Returns undefined if the key doesn't exist or the entry has expired.
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Adds or updates a value in the cache.
   */
  set(key: string, value: T, ttl?: number): void {
    if (this.cache.size >= this.options.maxSize) {
      this.evict();
    }

    const expires = Date.now() + (ttl || this.options.ttl);
    const entry: CacheEntry<T> = { value, expires };
    this.cache.set(key, entry);
  }

  /**
   * Checks if a key exists in the cache (and is not expired).
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Deletes a value from the cache.
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears the entire cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Returns the number of items in the cache.
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Evicts the oldest entry from the cache.
   * A simple eviction strategy based on insertion order.
   */
  private evict(): void {
    // A Map iterates in insertion order, so the first key is the oldest.
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Cleans up expired entries from the cache.
   * This can be called periodically to free up memory.
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Decorator to automatically cache the result of a method.
 * Note: Requires `experimentalDecorators` and `emitDecoratorMetadata` in tsconfig.
 * This is a more advanced example.
 */
export function Cacheable(options?: { ttl?: number }) {
  const cache = new MemoryCache<any>({ ttl: options?.ttl });

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      
      const cachedValue = cache.get(cacheKey);
      if (cachedValue) {
        console.log(`[Cache] HIT for ${cacheKey}`);
        return cachedValue;
      }

      console.log(`[Cache] MISS for ${cacheKey}`);
      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, result);
      return result;
    };

    return descriptor;
  };
}

/**
 * A wrapper function to add caching to any async function.
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cache: MemoryCache<Awaited<ReturnType<T>>>,
  keyGenerator: (...args: Parameters<T>) => string
): T {
  return async function (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    const cacheKey = keyGenerator(...args);

    const cachedValue = cache.get(cacheKey);
    if (cachedValue) {
      return cachedValue;
    }

    const result = await fn(...args);
    cache.set(cacheKey, result);
    return result;
  } as T;
}

// --- Singleton Cache Instance ---

let defaultCache: MemoryCache<any> | null = null;

export function getDefaultCache(): MemoryCache<any> {
  if (!defaultCache) {
    defaultCache = new MemoryCache({ ttl: 5 * 60 * 1000 }); // 5 minutes
  }
  return defaultCache;
}

// --- Example Usage ---
/*
  // Basic usage
  const userCache = new MemoryCache<{ id: string, name: string }>({ ttl: 10000 });
  userCache.set('user:123', { id: '123', name: 'Alice' });
  const user = userCache.get('user:123');

  // Using withCache wrapper
  async function fetchUserData(userId: string): Promise<{ id: string, name: string }> {
    // Imagine this is a slow API call
    console.log('Fetching user data...');
    return { id: userId, name: `User ${userId}` };
  }

  const cachedFetchUserData = withCache(
    fetchUserData,
    getDefaultCache(),
    (userId) => `user:${userId}`
  );

  await cachedFetchUserData('456'); // Fetches and caches
  await cachedFetchUserData('456'); // Returns from cache

  // Using the decorator (in a class)
  class UserAPI {
    @Cacheable({ ttl: 30000 })
    async getUser(userId: string) {
      console.log('Fetching from API class...');
      return { id: userId, name: `User from API class ${userId}` };
    }
  }

  const api = new UserAPI();
  await api.getUser('789'); // Fetches and caches
  await api.getUser('789'); // Returns from cache
*/ 