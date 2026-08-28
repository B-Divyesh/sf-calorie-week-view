import { DEFAULT_SETTINGS, type DayRecord, type Settings } from './types';

const DB_VERSION = 1;
const databaseName = (demo: boolean) => demo ? 'demo:calorie-week-view' : 'calorie-week-view';

export class WeekStore {
  private database: IDBDatabase | null = null;
  readonly demo: boolean;

  constructor(demo: boolean) {
    this.demo = demo;
  }

  private async db(): Promise<IDBDatabase> {
    if (this.database) return this.database;
    this.database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(databaseName(this.demo), DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('days')) db.createObjectStore('days', { keyPath: 'date' });
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.database;
  }

  private async request<T>(storeName: 'days' | 'settings', mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await this.db();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = action(transaction.objectStore(storeName));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async records(): Promise<DayRecord[]> {
    return this.request<DayRecord[]>('days', 'readonly', (store) => store.getAll());
  }

  async save(record: DayRecord): Promise<void> {
    await this.request<IDBValidKey>('days', 'readwrite', (store) => store.put(record));
  }

  async saveMany(records: DayRecord[]): Promise<void> {
    const db = await this.db();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('days', 'readwrite');
      const store = transaction.objectStore('days');
      records.forEach((record) => store.put(record));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async delete(date: string): Promise<void> {
    await this.request<undefined>('days', 'readwrite', (store) => store.delete(date));
  }

  async settings(): Promise<Settings> {
    const saved = await this.request<Settings | undefined>('settings', 'readonly', (store) => store.get('main'));
    return { ...DEFAULT_SETTINGS, ...saved };
  }

  async saveSettings(settings: Settings): Promise<void> {
    await this.request<IDBValidKey>('settings', 'readwrite', (store) => store.put(settings, 'main'));
  }

  async clear(): Promise<void> {
    const db = await this.db();
    await Promise.all(['days', 'settings'].map((name) => new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(name, 'readwrite');
      const request = transaction.objectStore(name).clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    })));
  }

  close(): void {
    this.database?.close();
    this.database = null;
  }

  async discard(): Promise<void> {
    this.close();
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(databaseName(this.demo));
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Close other tabs using the demo, then choose Start for real again.'));
    });
  }
}
