// src/sample-files/cache-manager.ts

interface CacheItem<T> {
  value: T;
  expiry: number;
}

class CacheManager<T> {
  private cache: Map<string, CacheItem<T>> = new Map();

  /**
   * @param key The key to store the data under.
   * @param value The data to store.
   * @param ttl Time to live in milliseconds.
   */
  public set(key: string, value: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  public get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const appCache = new CacheManager<any>(); 