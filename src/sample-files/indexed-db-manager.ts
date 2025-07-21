// src/sample-files/indexed-db-manager.ts

class IndexedDBManager {
    private db: IDBDatabase | null = null;
  
    constructor(private dbName: string, private dbVersion: number) {}
  
    public open(storeName: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        };
  
        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve();
        };
  
        request.onerror = (event) => {
          reject('IndexedDB error: ' + (event.target as IDBOpenDBRequest).error);
        };
      });
    }
  
    public add<T>(storeName: string, item: T): Promise<IDBValidKey> {
      return new Promise((resolve, reject) => {
        if (!this.db) {
            return reject('Database is not open.');
          }
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    public get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('Database is not open.');
              }
          const transaction = this.db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(key);
    
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }
  }
  
  export const dbManager = new IndexedDBManager('myAppDB', 1); 