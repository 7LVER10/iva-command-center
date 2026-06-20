/**
 * Persistence Adapter for IVA vNext
 *
 * Abstraction layer over storage backends.
 * Current: localStorage (dev/prototype)
 * Future: API-backed DB, IndexedDB, or server-side storage
 *
 * Usage:
 *   const store = createPersistenceAdapter('iva-history');
 *   await store.save(entries);
 *   const entries = await store.load();
 *   await store.clear();
 */

export interface PersistenceAdapter<T> {
  load(): Promise<T[]>;
  save(items: T[]): Promise<void>;
  append(item: T): Promise<void>;
  clear(): Promise<void>;
  count(): Promise<number>;
}

export interface PersistenceConfig {
  key: string;
  maxItems: number;
  backend: 'localStorage' | 'indexeddb' | 'api';
}

// ===== LOCAL STORAGE ADAPTER (dev/prototype) =====
function createLocalStorageAdapter<T>(key: string, maxItems: number): PersistenceAdapter<T> {
  return {
    async load(): Promise<T[]> {
      if (typeof window === 'undefined') return [];
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },

    async save(items: T[]): Promise<void> {
      if (typeof window === 'undefined') return;
      const trimmed = items.slice(0, maxItems);
      localStorage.setItem(key, JSON.stringify(trimmed));
    },

    async append(item: T): Promise<void> {
      const items = await this.load();
      items.unshift(item);
      await this.save(items);
    },

    async clear(): Promise<void> {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    },

    async count(): Promise<number> {
      const items = await this.load();
      return items.length;
    },
  };
}

// ===== INDEXED DB ADAPTER (production-ready) =====
function createIndexedDBAdapter<T>(dbName: string, storeName: string, maxItems: number): PersistenceAdapter<T> {
  function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB not available'));
        return;
      }
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return {
    async load(): Promise<T[]> {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const request = store.getAll();
          request.onsuccess = () => {
            const items = request.result.slice(0, maxItems);
            resolve(items);
          };
          request.onerror = () => reject(request.error);
        });
      } catch {
        return [];
      }
    },

    async save(items: T[]): Promise<void> {
      try {
        const db = await openDB();
        const trimmed = items.slice(0, maxItems);
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          store.clear();
          trimmed.forEach(item => store.put(item));
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      } catch {}
    },

    async append(item: T): Promise<void> {
      const items = await this.load();
      items.unshift(item);
      await this.save(items);
    },

    async clear(): Promise<void> {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch {}
    },

    async count(): Promise<number> {
      const items = await this.load();
      return items.length;
    },
  };
}

// ===== API ADAPTER (future: server-side) =====
function createApiAdapter<T>(apiUrl: string, maxItems: number): PersistenceAdapter<T> {
  return {
    async load(): Promise<T[]> {
      try {
        const res = await fetch(`${apiUrl}?limit=${maxItems}`);
        if (!res.ok) return [];
        return await res.json();
      } catch {
        return [];
      }
    },

    async save(items: T[]): Promise<void> {
      try {
        await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(items.slice(0, maxItems)),
        });
      } catch {}
    },

    async append(item: T): Promise<void> {
      try {
        await fetch(`${apiUrl}/append`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch {}
    },

    async clear(): Promise<void> {
      try {
        await fetch(apiUrl, { method: 'DELETE' });
      } catch {}
    },

    async count(): Promise<number> {
      try {
        const res = await fetch(`${apiUrl}/count`);
        if (!res.ok) return 0;
        const data = await res.json();
        return data.count ?? 0;
      } catch {
        return 0;
      }
    },
  };
}

// ===== FACTORY =====
export function createPersistenceAdapter<T>(config: PersistenceConfig): PersistenceAdapter<T> {
  switch (config.backend) {
    case 'indexeddb':
      return createIndexedDBAdapter(`iva-${config.key}`, config.key, config.maxItems);
    case 'api':
      return createApiAdapter(`/api/persistence/${config.key}`, config.maxItems);
    case 'localStorage':
    default:
      return createLocalStorageAdapter(`iva-${config.key}`, config.maxItems);
  }
}
