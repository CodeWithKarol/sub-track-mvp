import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageApi {
  getItems<T>(key: string): T[] {
    const items = localStorage.getItem(key);

    return items ? (JSON.parse(items) as T[]) : ([] as T[]);
  }

  setItems<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }
}
