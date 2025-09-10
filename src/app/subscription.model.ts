export interface Subscription {
  id: string;
  serviceName: string;
  cost: number;
  nextPaymentDate: Date;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
}

export type SubscriptionCategory = 'Entertainment' | 'Music' | 'Productivity' | 'Shopping';

export type BillingCycle = 'monthly' | 'yearly';

export const subscriptionCategories: SubscriptionCategory[] = [
  'Entertainment',
  'Music',
  'Productivity',
  'Shopping',
];

export const billingCycles: BillingCycle[] = ['monthly', 'yearly'] as const;
