import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageApi {
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  getItems<T>(key: string): T[] {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return [];
    }

    try {
      const items = localStorage.getItem(key);
      if (!items) {
        return [];
      }

      const parsed = JSON.parse(items);

      // Validate that parsed data is an array
      if (!Array.isArray(parsed)) {
        console.warn(`Data for key "${key}" is not an array, returning empty array`);
        return [];
      }

      return parsed as T[];
    } catch (error) {
      console.error(`Error parsing localStorage data for key "${key}":`, error);
      // Clear corrupted data
      this.clearItem(key);
      return [];
    }
  }

  setItems<T>(key: string, items: T[]): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available, data will not be saved');
      return;
    }

    if (!Array.isArray(items)) {
      console.error('Items must be an array');
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving data to localStorage for key "${key}":`, error);
    }
  }

  clearItem(key: string): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage for key "${key}":`, error);
    }
  }

  clearAll(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
