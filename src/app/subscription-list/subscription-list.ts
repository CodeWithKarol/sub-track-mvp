import {
  Component,
  computed,
  inject,
  linkedSignal,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { SubscriptionsData } from '../subscriptions-data';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSubscriptionDialog } from '../delete-subscription-dialog/delete-subscription-dialog';
import { UpdateSubscriptionDialog } from '../update-subscription-dialog/update-subscription-dialog';
import { CreateSubscriptionDialog } from '../create-subscription-dialog/create-subscription-dialog';
import { filter, take, tap } from 'rxjs';
import { billingCycles, Subscription, subscriptionCategories } from '../subscription.model';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSort, MatSortModule } from '@angular/material/sort';

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

type TimelineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-subscription-list',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
    NgApexchartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    DatePipe,
    TitleCasePipe,
    MatIconModule,
    MatPaginatorModule,
    FormsModule,
    MatDatepickerModule,
    MatSortModule,
  ],
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.scss',
})
export class SubscriptionList implements OnInit {
  private readonly paginator = viewChild.required(MatPaginator);
  private readonly sort = viewChild.required(MatSort);
  private readonly subscriptionsData = inject(SubscriptionsData);
  private readonly dialog = inject(MatDialog);
  protected $subscriptions = this.subscriptionsData.$subscriptions;
  protected $totalCost = this.subscriptionsData.$totalCost;
  protected $dataSource = computed<MatTableDataSource<Subscription>>(() => {
    const subscriptions = this.$filteredSubscriptions();
    const dataSource = new MatTableDataSource<Subscription>(subscriptions);
    dataSource.paginator = this.paginator();
    dataSource.sort = this.sort();
    return dataSource;
  });

  // Computed property to group and sum costs by category
  private categoryData = computed(() => {
    const subscriptions = this.$subscriptions();
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
    const subscriptions = this.$subscriptions();
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
    const subscriptions = this.$subscriptions();

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
    const subscriptions = this.$subscriptions();
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

  protected selectedCategory = signal('');
  protected selectedBillingCycle = signal('');
  protected searchTerm = signal('');
  protected selectedStartDate = signal<Date | null>(null);
  protected selectedEndDate = signal<Date | null>(null);
  protected readonly categories = subscriptionCategories;
  protected readonly billingCycles = billingCycles;

  protected $filteredSubscriptions = linkedSignal(() => {
    const subscriptions = this.$subscriptions();
    const searchTerm = this.searchTerm();
    const selectedCategory = this.selectedCategory();
    const selectedBillingCycle = this.selectedBillingCycle();
    const selectedStartDate = this.selectedStartDate();
    const selectedEndDate = this.selectedEndDate();

    if (
      !searchTerm &&
      !selectedCategory &&
      !selectedBillingCycle &&
      !selectedStartDate &&
      !selectedEndDate
    ) {
      return subscriptions;
    }

    return subscriptions.filter((sub) => {
      const matchesCategory = !selectedCategory || sub.category === selectedCategory;
      const matchesBillingCycle =
        !selectedBillingCycle || sub.billingCycle === selectedBillingCycle;
      const matchesSearchTerm =
        !searchTerm || sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStartDate = !selectedStartDate || sub.nextPaymentDate >= selectedStartDate;
      const matchesEndDate = !selectedEndDate || sub.nextPaymentDate <= selectedEndDate;
      return (
        matchesCategory &&
        matchesBillingCycle &&
        matchesSearchTerm &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  });

  displayedColumns: string[] = [
    'serviceName',
    'cost',
    'nextPaymentDate',
    'billingCycle',
    'category',
    'actions',
  ];

  ngOnInit(): void {
    this.subscriptionsData.loadInitialData();
  }

  deleteSubscription({ id, serviceName }: Subscription): void {
    this.dialog
      .open(DeleteSubscriptionDialog, {
        data: { serviceName },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((confirmed) => !!confirmed),
        tap(() => this.subscriptionsData.removeSubscription(id)),
      )
      .subscribe();
  }

  updateSubscription(subscription: Subscription): void {
    this.dialog
      .open(UpdateSubscriptionDialog, {
        data: {
          ...subscription,
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((result): result is Omit<Subscription, 'id'> => !!result),
        tap((result) =>
          this.subscriptionsData.updateSubscription({ id: subscription.id, ...result }),
        ),
      )
      .subscribe();
  }

  createSubscription(): void {
    this.dialog
      .open(CreateSubscriptionDialog)
      .afterClosed()
      .pipe(
        take(1),
        filter((result): result is Omit<Subscription, 'id'> => !!result),
        tap((result) => this.subscriptionsData.addSubscription(result)),
      )
      .subscribe();
  }
}
