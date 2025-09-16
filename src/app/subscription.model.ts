export interface Subscription {
  id: string;
  serviceName: string;
  cost: number;
  nextPaymentDate: Date;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
}

export type SubscriptionCategory =
  | 'Entertainment'
  | 'Music'
  | 'Productivity'
  | 'Shopping'
  | 'Design'
  | 'Development'
  | 'Gaming'
  | 'Security'
  | 'Education';

export type BillingCycle = 'monthly' | 'yearly';

export const subscriptionCategories = [
  {
    value: 'Entertainment',
    viewValue: 'Entertainment',
  },
  {
    value: 'Music',
    viewValue: 'Music',
  },
  {
    value: 'Productivity',
    viewValue: 'Productivity',
  },
  {
    value: 'Shopping',
    viewValue: 'Shopping',
  },
  {
    value: 'Design',
    viewValue: 'Design',
  },
  {
    value: 'Development',
    viewValue: 'Development',
  },
  {
    value: 'Gaming',
    viewValue: 'Gaming',
  },
  {
    value: 'Security',
    viewValue: 'Security',
  },
  {
    value: 'Education',
    viewValue: 'Education',
  },
] as const;

export const billingCycles = [
  {
    value: 'monthly',
    viewValue: 'Monthly',
  },
  {
    value: 'yearly',
    viewValue: 'Yearly',
  },
] as const;

export const displayedColumns = [
  'serviceName',
  'cost',
  'nextPaymentDate',
  'billingCycle',
  'category',
  'actions',
] as const;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface FilterState {
  searchTerm: string;
  category: string;
  billingCycle: string;
  dateRange: DateRange;
}
