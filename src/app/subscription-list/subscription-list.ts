import {Component, computed, inject, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';
import {SubscriptionsData} from '../subscriptions-data';
import {MatDialog} from '@angular/material/dialog';
import {DeleteSubscriptionDialog} from '../delete-subscription-dialog/delete-subscription-dialog';
import {UpdateSubscriptionDialog} from '../update-subscription-dialog/update-subscription-dialog';
import {CreateSubscriptionDialog} from '../create-subscription-dialog/create-subscription-dialog';
import {filter, take, tap} from 'rxjs';
import {Subscription} from '../subscription.model';
import {ApexChart, ApexNonAxisChartSeries, ApexResponsive, ApexTooltip, NgApexchartsModule,} from 'ng-apexcharts';

type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-subscription-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    NgApexchartsModule,
  ],
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.scss',
})
export class SubscriptionList implements OnInit {
  private readonly subscriptionsData = inject(SubscriptionsData);
  private readonly dialog = inject(MatDialog);
  protected $subscriptions = this.subscriptionsData.$subscriptions;
  protected $totalCost = this.subscriptionsData.$totalCost;
  // Computed property to group and sum costs by category
  protected categoryData = computed(() => {
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
  protected pieChartOptions: PieChartOptions = {
    series: this.categoryData().series,
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: this.categoryData().labels,
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
