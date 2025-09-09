import { TestBed } from '@angular/core/testing';

import { LocalStorageApi } from './local-storage-api';

describe('LocalStorageApi', () => {
  let service: LocalStorageApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
