import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexTooltip,
  ApexXAxis
} from 'ng-apexcharts';

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

// Chart type definitions
export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  tooltip: ApexTooltip;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
};

// Chart data interfaces
export interface ChartData {
  labels: string[];
  series: number[];
}

export interface MonthlyData extends ChartData {
  sortedEntries: Array<[string, number]>;
}

// Chart configuration constants
export const CHART_CONFIG = {
  PIE_WIDTH: 380,
  PIE_WIDTH_MOBILE: 200,
  BAR_HEIGHT: 350,
  MOBILE_BREAKPOINT: 480,
  TOP_SUBSCRIPTIONS_LIMIT: 5,
} as const;
