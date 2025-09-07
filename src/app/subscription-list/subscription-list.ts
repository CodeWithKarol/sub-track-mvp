import { Component } from '@angular/core';
import { Subscription } from '../subscription.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-subscription-list',
  imports: [MatCardModule, MatButtonModule, CurrencyPipe, DatePipe],
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.scss',
})
export class SubscriptionList {
  subscriptions: Subscription[] = [
    {
      id: 'sub1',
      serviceName: 'Netflix',
      cost: 12.99,
      nextPaymentDate: new Date('2025-09-15'),
      billingCycle: 'monthly',
    },
    {
      id: 'sub2',
      serviceName: 'Spotify',
      cost: 9.99,
      nextPaymentDate: new Date('2025-09-20'),
      billingCycle: 'monthly',
    },
    {
      id: 'sub3',
      serviceName: 'Adobe Creative Cloud',
      cost: 52.99,
      nextPaymentDate: new Date('2025-10-01'),
      billingCycle: 'monthly',
    },
    {
      id: 'sub4',
      serviceName: 'Amazon Prime',
      cost: 139.0,
      nextPaymentDate: new Date('2026-01-05'),
      billingCycle: 'yearly',
    },
    {
      id: 'sub5',
      serviceName: 'Microsoft 365',
      cost: 69.99,
      nextPaymentDate: new Date('2025-12-10'),
      billingCycle: 'yearly',
    },
  ];

  getTotalCost(): number {
    return this.subscriptions.reduce((total, subscription) => total + subscription.cost, 0);
  }
}
