import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
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
import { NgApexchartsModule } from 'ng-apexcharts';
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
import { SpendingOverview } from '../spending-overview/spending-overview';

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
    SpendingOverview,
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

  protected selectedCategory = signal('');
  protected selectedBillingCycle = signal('');
  protected searchTerm = signal('');
  protected selectedStartDate = signal<Date | null>(null);
  protected selectedEndDate = signal<Date | null>(null);
  protected readonly categories = subscriptionCategories;
  protected readonly billingCycles = billingCycles;

  protected $filteredSubscriptions = computed(() => {
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
      // Category filter
      const matchesCategory = !selectedCategory || sub.category === selectedCategory;

      // Billing cycle filter
      const matchesBillingCycle =
        !selectedBillingCycle || sub.billingCycle === selectedBillingCycle;

      // Search term filter (case insensitive)
      const matchesSearchTerm =
        !searchTerm || sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filters - ensure proper date comparison
      let matchesStartDate = true;
      let matchesEndDate = true;

      if (selectedStartDate || selectedEndDate) {
        const subDate = new Date(sub.nextPaymentDate);

        if (selectedStartDate) {
          const startDate = new Date(selectedStartDate);
          // Set start date to beginning of day for inclusive comparison
          startDate.setHours(0, 0, 0, 0);
          matchesStartDate = subDate >= startDate;
        }

        if (selectedEndDate) {
          const endDate = new Date(selectedEndDate);
          // Set end date to end of day for inclusive comparison
          endDate.setHours(23, 59, 59, 999);
          matchesEndDate = subDate <= endDate;
        }
      }

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
