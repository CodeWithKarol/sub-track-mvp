import { computed, Injectable, signal } from '@angular/core';
import { Subscription } from './subscription.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsData {
  $subscriptions = signal<Subscription[]>([
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
  ]);

  $totalCost = computed(() => {
    return this.$subscriptions().reduce((total, subscription) => {
      return total + subscription.cost;
    }, 0);
  });

  isNearDue(subscription: Subscription): boolean {
    const today = new Date();
    const dueDate = new Date(subscription.nextPaymentDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilDue <= 14;
  }

  $numOfDueSubscriptions = computed(() => {
    return this.$subscriptions().filter((subscription) => this.isNearDue(subscription)).length;
  });
}
