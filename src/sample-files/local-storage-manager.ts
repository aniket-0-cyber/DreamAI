// src/sample-files/local-storage-manager.ts

class LocalStorageManager {
    public setItem<T>(key: string, value: T): boolean {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return true;
      } catch (error) {
        console.error(`Error setting item in localStorage: ${key}`, error);
        return false;
      }
    }
  
    public getItem<T>(key: string): T | null {
      try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
          return null;
        }
        return JSON.parse(serializedValue) as T;
      } catch (error) {
        console.error(`Error getting item from localStorage: ${key}`, error);
        return null;
      }
    }
  
    public removeItem(key: string): void {
      localStorage.removeItem(key);
    }
  
    public clear(): void {
      localStorage.clear();
    }
  }
  
  export const localStorageManager = new LocalStorageManager(); 