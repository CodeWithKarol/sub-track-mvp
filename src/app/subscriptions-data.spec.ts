import { TestBed } from '@angular/core/testing';

import { SubscriptionsData } from './subscriptions-data';

describe('SubscriptionsData', () => {
  let service: SubscriptionsData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionsData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
