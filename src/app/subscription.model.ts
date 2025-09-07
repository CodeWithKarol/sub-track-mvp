export interface Subscription {
  id: string; // Unique identifier
  serviceName: string; // Name of the subscription service
  cost: number; // Subscription cost
  nextPaymentDate: Date; // Date of next payment due
  billingCycle: 'monthly' | 'yearly'; // Simplified billing cycle options
}
