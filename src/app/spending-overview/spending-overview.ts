import { Component, computed, input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexTooltip,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { Subscription } from '../subscription.model';

type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  tooltip: ApexTooltip;
};

type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-spending-overview',
  imports: [ChartComponent],
  templateUrl: './spending-overview.html',
  styleUrl: './spending-overview.scss',
})
export class SpendingOverview {
  subscriptions = input.required<Subscription[]>();
  // Computed property to group and sum costs by category
  private categoryData = computed(() => {
    const subscriptions = this.subscriptions();
    const categoryMap = new Map<string, number>();

    // Group by category and sum costs
    subscriptions.forEach((sub) => {
      const currentSum = categoryMap.get(sub.category) || 0;
      categoryMap.set(sub.category, currentSum + sub.cost);
    });

    return {
      labels: Array.from(categoryMap.keys()),
      series: Array.from(categoryMap.values()),
    };
  });

  // Computed property for pie chart options
  protected pieChartOptions = computed<PieChartOptions>(() => {
    const { labels, series } = this.categoryData();

    return {
      series,
      chart: {
        width: 380,
        type: 'pie',
      },
      labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      tooltip: {
        y: {
          formatter: function (val) {
            return `$${val.toFixed(2)}`;
          },
        },
      },
    };
  });

  // Computed property to group subscriptions by month from nextPaymentDate
  private monthlyData = computed(() => {
    const subscriptions = this.subscriptions();
    const monthlyMap = new Map<string, number>();

    // Group by month-year and sum costs
    subscriptions.forEach((sub) => {
      if (sub.nextPaymentDate) {
        const date = new Date(sub.nextPaymentDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const currentSum = monthlyMap.get(monthYear) || 0;
        monthlyMap.set(monthYear, currentSum + sub.cost);
      }
    });

    // Sort by month-year
    const sortedEntries = Array.from(monthlyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    return {
      labels: sortedEntries.map(([monthYear]) => monthYear),
      series: sortedEntries.map(([, cost]) => cost.toFixed(2)).map((cost) => parseFloat(cost)),
    };
  });

  barChartOptions = computed<BarChartOptions>(() => {
    const { labels, series } = this.monthlyData();
    return {
      series: [
        {
          name: 'Total Cost',
          data: series,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: string | number | number[]) {
          const numVal = typeof val === 'number' ? val : Number(val);
          return `$${numVal.toFixed(2)}`;
        },
      },
      xaxis: {
        categories: labels,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `$${val.toFixed(2)}`;
          },
        },
      },
    };
  });

  // Computed property for top costly subscriptions
  private topCostlyData = computed(() => {
    const subscriptions = this.subscriptions();

    // Sort by cost descending and take top 5
    const topSubscriptions = subscriptions.sort((a, b) => b.cost - a.cost).slice(0, 5);

    return {
      labels: topSubscriptions.map((sub) => sub.serviceName),
      series: topSubscriptions.map((sub) => sub.cost),
    };
  });

  protected topCostlyChartOptions = computed<BarChartOptions>(() => {
    const { labels, series } = this.topCostlyData();

    return {
      series: [
        {
          name: 'Cost',
          data: series,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: string | number | number[]) {
          const numVal = typeof val === 'number' ? val : Number(val);
          return `$${numVal.toFixed(2)}`;
        },
      },
      xaxis: {
        categories: labels,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `$${val.toFixed(2)}`;
          },
        },
      },
    };
  });

  // Computed property for billing cycle cost distribution
  private billingCycleData = computed(() => {
    const subscriptions = this.subscriptions();
    const cycleMap = new Map<string, number>();

    // Group by billing cycle and sum costs
    subscriptions.forEach((sub) => {
      const currentSum = cycleMap.get(sub.billingCycle) || 0;
      cycleMap.set(sub.billingCycle, currentSum + sub.cost);
    });

    return {
      labels: Array.from(cycleMap.keys()).map((cycle) =>
        cycle === 'monthly' ? 'Monthly' : 'Yearly',
      ),
      series: Array.from(cycleMap.values()).map((cost) => parseFloat(cost.toFixed(2))),
    };
  });

  protected billingCycleChartOptions = computed<BarChartOptions>(() => {
    const { labels, series } = this.billingCycleData();

    return {
      series: [
        {
          name: 'Total Cost',
          data: series,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        categories: labels,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: string | number | number[]) {
          const numVal = typeof val === 'number' ? val : Number(val);
          return `$${numVal.toFixed(2)}`;
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `$${val.toFixed(2)}`;
          },
        },
      },
    };
  });
}
