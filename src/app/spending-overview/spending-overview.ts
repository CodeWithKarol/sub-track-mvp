import { Component, computed, input } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import {
  BarChartOptions,
  CHART_CONFIG,
  ChartData,
  MonthlyData,
  PieChartOptions,
  Subscription,
} from '../subscription.model';

const CURRENCY_FORMATTER = {
  format: (val: number): string => `$${val.toFixed(2)}`,
  parseValue: (val: string | number | number[]): number => {
    return typeof val === 'number' ? val : Number(val);
  },
} as const;

@Component({
  selector: 'app-spending-overview',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './spending-overview.html',
  styleUrl: './spending-overview.scss',
})
export class SpendingOverview {
  // Input
  readonly subscriptions = input.required<Subscription[]>();

  // Data processing computed properties
  private readonly categoryData = computed<ChartData>(() => {
    return this.processSubscriptionsByCategory();
  });

  private readonly monthlyData = computed<MonthlyData>(() => {
    return this.processSubscriptionsByMonth();
  });

  private readonly topCostlyData = computed<ChartData>(() => {
    return this.processTopCostlySubscriptions();
  });

  private readonly billingCycleData = computed<ChartData>(() => {
    return this.processBillingCycleDistribution();
  });

  // Chart options computed properties
  readonly pieChartOptions = computed<PieChartOptions>(() => {
    return this.createPieChartOptions();
  });

  readonly barChartOptions = computed<BarChartOptions>(() => {
    return this.createMonthlyBarChartOptions();
  });

  readonly topCostlyChartOptions = computed<BarChartOptions>(() => {
    return this.createTopCostlyBarChartOptions();
  });

  readonly billingCycleChartOptions = computed<BarChartOptions>(() => {
    return this.createBillingCycleBarChartOptions();
  });

  // Data processing methods
  private processSubscriptionsByCategory(): ChartData {
    const subscriptions = this.subscriptions();
    const categoryMap = this.groupByCategoryAndSum(subscriptions);

    return {
      labels: Array.from(categoryMap.keys()),
      series: Array.from(categoryMap.values()),
    };
  }

  private processSubscriptionsByMonth(): MonthlyData {
    const subscriptions = this.subscriptions();
    const monthlyMap = this.groupByMonthAndSum(subscriptions);
    const sortedEntries = this.sortEntriesByMonth(monthlyMap);

    return {
      labels: sortedEntries.map(([monthYear]) => monthYear),
      series: sortedEntries.map(([, cost]) => parseFloat(cost.toFixed(2))),
      sortedEntries,
    };
  }

  private processTopCostlySubscriptions(): ChartData {
    const subscriptions = [...this.subscriptions()];
    const topSubscriptions = subscriptions
      .sort((a, b) => b.cost - a.cost)
      .slice(0, CHART_CONFIG.TOP_SUBSCRIPTIONS_LIMIT);

    return {
      labels: topSubscriptions.map((sub) => sub.serviceName),
      series: topSubscriptions.map((sub) => sub.cost),
    };
  }

  private processBillingCycleDistribution(): ChartData {
    const subscriptions = this.subscriptions();
    const cycleMap = this.groupByCycleAndSum(subscriptions);

    return {
      labels: Array.from(cycleMap.keys()).map(this.formatBillingCycleLabel),
      series: Array.from(cycleMap.values()).map((cost) => parseFloat(cost.toFixed(2))),
    };
  }

  // Utility methods for data grouping
  private groupByCategoryAndSum(subscriptions: Subscription[]): Map<string, number> {
    const categoryMap = new Map<string, number>();

    subscriptions.forEach((sub) => {
      const currentSum = categoryMap.get(sub.category) || 0;
      categoryMap.set(sub.category, currentSum + sub.cost);
    });

    return categoryMap;
  }

  private groupByMonthAndSum(subscriptions: Subscription[]): Map<string, number> {
    const monthlyMap = new Map<string, number>();

    subscriptions.forEach((sub) => {
      if (sub.nextPaymentDate) {
        const monthYear = this.formatDateToMonthYear(new Date(sub.nextPaymentDate));
        const currentSum = monthlyMap.get(monthYear) || 0;
        monthlyMap.set(monthYear, currentSum + sub.cost);
      }
    });

    return monthlyMap;
  }

  private groupByCycleAndSum(subscriptions: Subscription[]): Map<string, number> {
    const cycleMap = new Map<string, number>();

    subscriptions.forEach((sub) => {
      const currentSum = cycleMap.get(sub.billingCycle) || 0;
      cycleMap.set(sub.billingCycle, currentSum + sub.cost);
    });

    return cycleMap;
  }

  // Chart creation methods
  private createPieChartOptions(): PieChartOptions {
    const { labels, series } = this.categoryData();

    return {
      series,
      chart: {
        width: CHART_CONFIG.PIE_WIDTH,
        type: 'pie',
      },
      labels,
      responsive: [
        {
          breakpoint: CHART_CONFIG.MOBILE_BREAKPOINT,
          options: {
            chart: {
              width: CHART_CONFIG.PIE_WIDTH_MOBILE,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      tooltip: {
        y: {
          formatter: CURRENCY_FORMATTER.format,
        },
      },
    };
  }

  private createMonthlyBarChartOptions(): BarChartOptions {
    const { labels, series } = this.monthlyData();

    return this.createBarChartBase({
      seriesName: 'Total Cost',
      data: series,
      categories: labels,
      horizontal: true,
    });
  }

  private createTopCostlyBarChartOptions(): BarChartOptions {
    const { labels, series } = this.topCostlyData();

    return this.createBarChartBase({
      seriesName: 'Cost',
      data: series,
      categories: labels,
      horizontal: true,
    });
  }

  private createBillingCycleBarChartOptions(): BarChartOptions {
    const { labels, series } = this.billingCycleData();

    return this.createBarChartBase({
      seriesName: 'Total Cost',
      data: series,
      categories: labels,
      horizontal: false,
    });
  }

  // Base chart creation method
  private createBarChartBase(config: {
    seriesName: string;
    data: number[];
    categories: string[];
    horizontal: boolean;
  }): BarChartOptions {
    return {
      series: [
        {
          name: config.seriesName,
          data: config.data,
        },
      ],
      chart: {
        type: 'bar',
        height: CHART_CONFIG.BAR_HEIGHT,
      },
      plotOptions: {
        bar: {
          horizontal: config.horizontal,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: string | number | number[]) => {
          const numVal = CURRENCY_FORMATTER.parseValue(val);
          return CURRENCY_FORMATTER.format(numVal);
        },
      },
      xaxis: {
        categories: config.categories,
      },
      tooltip: {
        y: {
          formatter: CURRENCY_FORMATTER.format,
        },
      },
    };
  }

  // Helper formatting methods
  private formatDateToMonthYear(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private formatBillingCycleLabel(cycle: string): string {
    return cycle === 'monthly' ? 'Monthly' : 'Yearly';
  }

  private sortEntriesByMonth(monthlyMap: Map<string, number>): Array<[string, number]> {
    return Array.from(monthlyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }
}
