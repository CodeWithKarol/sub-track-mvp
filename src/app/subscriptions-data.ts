import { computed, inject, Injectable, signal } from '@angular/core';
import { LocalStorageApi } from './local-storage-api';
import { Subscription } from './subscription.model';

const initialSubscriptions: Subscription[] = [
  {
    id: 'sub1',
    serviceName: 'Netflix',
    cost: 12.99,
    nextPaymentDate: new Date('2025-09-15'),
    billingCycle: 'monthly',
    category: 'Entertainment',
  },
  {
    id: 'sub2',
    serviceName: 'Spotify',
    cost: 9.99,
    nextPaymentDate: new Date('2025-09-20'),
    billingCycle: 'monthly',
    category: 'Music',
  },
  {
    id: 'sub3',
    serviceName: 'Adobe Creative Cloud',
    cost: 52.99,
    nextPaymentDate: new Date('2025-10-01'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub4',
    serviceName: 'Amazon Prime',
    cost: 139.0,
    nextPaymentDate: new Date('2026-01-05'),
    billingCycle: 'yearly',
    category: 'Shopping',
  },
  {
    id: 'sub5',
    serviceName: 'Microsoft 365',
    cost: 69.99,
    nextPaymentDate: new Date('2025-12-10'),
    billingCycle: 'yearly',
    category: 'Productivity',
  },

  {
    id: 'sub6',
    serviceName: 'Disney+',
    cost: 8.99,
    nextPaymentDate: new Date('2025-09-25'),
    billingCycle: 'monthly',
    category: 'Entertainment',
  },
  {
    id: 'sub7',
    serviceName: 'HBO Max',
    cost: 14.99,
    nextPaymentDate: new Date('2025-09-30'),
    billingCycle: 'monthly',
    category: 'Entertainment',
  },
  {
    id: 'sub8',
    serviceName: 'Apple Music',
    cost: 10.99,
    nextPaymentDate: new Date('2025-09-18'),
    billingCycle: 'monthly',
    category: 'Music',
  },
  {
    id: 'sub9',
    serviceName: 'YouTube Premium',
    cost: 11.99,
    nextPaymentDate: new Date('2025-09-22'),
    billingCycle: 'monthly',
    category: 'Entertainment',
  },
  {
    id: 'sub10',
    serviceName: 'Dropbox',
    cost: 19.99,
    nextPaymentDate: new Date('2025-10-05'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub11',
    serviceName: 'Google Workspace',
    cost: 6.0,
    nextPaymentDate: new Date('2025-09-28'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub12',
    serviceName: 'Canva Pro',
    cost: 12.99,
    nextPaymentDate: new Date('2025-10-02'),
    billingCycle: 'monthly',
    category: 'Design',
  },
  {
    id: 'sub13',
    serviceName: 'Coursera Plus',
    cost: 59.0,
    nextPaymentDate: new Date('2025-11-01'),
    billingCycle: 'monthly',
    category: 'Education',
  },
  {
    id: 'sub14',
    serviceName: 'Udemy',
    cost: 19.99,
    nextPaymentDate: new Date('2025-10-10'),
    billingCycle: 'monthly',
    category: 'Education',
  },
  {
    id: 'sub15',
    serviceName: 'PlayStation Plus',
    cost: 59.99,
    nextPaymentDate: new Date('2025-12-15'),
    billingCycle: 'yearly',
    category: 'Gaming',
  },
  {
    id: 'sub16',
    serviceName: 'Xbox Game Pass',
    cost: 9.99,
    nextPaymentDate: new Date('2025-09-19'),
    billingCycle: 'monthly',
    category: 'Gaming',
  },
  {
    id: 'sub17',
    serviceName: 'LinkedIn Premium',
    cost: 29.99,
    nextPaymentDate: new Date('2025-10-03'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub18',
    serviceName: 'NordVPN',
    cost: 59.0,
    nextPaymentDate: new Date('2026-02-01'),
    billingCycle: 'yearly',
    category: 'Security',
  },
  {
    id: 'sub19',
    serviceName: 'Grammarly',
    cost: 12.0,
    nextPaymentDate: new Date('2025-09-27'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub20',
    serviceName: 'Notion',
    cost: 4.0,
    nextPaymentDate: new Date('2025-09-21'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub21',
    serviceName: 'Evernote',
    cost: 7.99,
    nextPaymentDate: new Date('2025-09-23'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub22',
    serviceName: 'Slack',
    cost: 6.67,
    nextPaymentDate: new Date('2025-09-29'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub23',
    serviceName: 'Zoom Pro',
    cost: 14.99,
    nextPaymentDate: new Date('2025-10-07'),
    billingCycle: 'monthly',
    category: 'Productivity',
  },
  {
    id: 'sub24',
    serviceName: 'GitHub Copilot',
    cost: 10.0,
    nextPaymentDate: new Date('2025-09-26'),
    billingCycle: 'monthly',
    category: 'Development',
  },
  {
    id: 'sub25',
    serviceName: 'Figma',
    cost: 12.0,
    nextPaymentDate: new Date('2025-10-04'),
    billingCycle: 'monthly',
    category: 'Design',
  },
];

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsData {
  private readonly localStorageApi = inject(LocalStorageApi);
  $subscriptions = signal<Subscription[]>([]);
  $totalCost = computed(() => {
    return this.$subscriptions().reduce((total, subscription) => {
      return total + subscription.cost;
    }, 0);
  });

  loadInitialData(): void {
    const storedSubscriptions = this.localStorageApi.getItems<Subscription>('subscriptions');

    if (storedSubscriptions.length > 0) {
      // Convert stored date strings back to Date objects
      const subscriptionsWithDates = storedSubscriptions.map((sub) => ({
        ...sub,
        nextPaymentDate: new Date(sub.nextPaymentDate),
      }));
      this.$subscriptions.set(subscriptionsWithDates);
    } else {
      this.$subscriptions.set(initialSubscriptions);
      // Save initial data to localStorage
      this.localStorageApi.setItems('subscriptions', initialSubscriptions);
    }
  }

  isNearDue(subscription: Subscription): boolean {
    const today = new Date();
    // Normalize today to start of day (remove time component)
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(subscription.nextPaymentDate);
    // Normalize due date to start of day (remove time component)
    dueDate.setHours(0, 0, 0, 0);

    const timeDifference = dueDate.getTime() - today.getTime();
    const daysUntilDue = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // Return true if payment is due within 7 days (0-7 days, excluding overdue payments)
    return daysUntilDue >= 0 && daysUntilDue <= 7;
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
