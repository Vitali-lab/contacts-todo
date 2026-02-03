export class StorageService<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  get(): T[] {
    const value = localStorage.getItem(this.key);
    if (value) {
      return JSON.parse(value);
    } else {
      return [];
    }
  }
  set(value: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }
}
