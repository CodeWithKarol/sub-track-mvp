import { computed, inject, Injectable, signal } from '@angular/core';
import { Subscription } from './subscription.model';
import { LocalStorageApi } from './local-storage-api';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsData {
  private readonly localStorageApi = inject(LocalStorageApi);
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
  $dueSubscriptions = computed(() => {
    return this.$subscriptions().filter((subscription) => this.isNearDue(subscription));
  });

  $numOfDueSubscriptions = computed(() => this.$dueSubscriptions().length);

  addSubscription(subscription: Omit<Subscription, 'id'>): void {
    const subscriptionWithId: Subscription = {
      ...subscription,
      id: `sub${Math.random().toString(36).substring(2, 9)}`,
    };

    this.$subscriptions.update((subscriptions) => [...subscriptions, subscriptionWithId]);

    // Save to local storage
    this.localStorageApi.setItems('subscriptions', this.$subscriptions());
  }

  removeSubscription(id: string): void {
    this.$subscriptions.update((subscriptions) =>
      subscriptions.filter((subscription) => subscription.id !== id),
    );

    // Save to local storage
    this.localStorageApi.setItems('subscriptions', this.$subscriptions());
  }

  updateSubscription(updatedSubscription: Subscription): void {
    this.$subscriptions.update((subscriptions) =>
      subscriptions.map((subscription) =>
        subscription.id === updatedSubscription.id ? updatedSubscription : subscription,
      ),
    );

    // Save to local storage
    this.localStorageApi.setItems('subscriptions', this.$subscriptions());
  }
}
