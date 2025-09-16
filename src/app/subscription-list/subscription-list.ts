import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { filter, take, tap } from 'rxjs';
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

import { SubscriptionsData } from '../subscriptions-data';
import { DeleteSubscriptionDialog } from '../delete-subscription-dialog/delete-subscription-dialog';
import { UpdateSubscriptionDialog } from '../update-subscription-dialog/update-subscription-dialog';
import { CreateSubscriptionDialog } from '../create-subscription-dialog/create-subscription-dialog';
import { SpendingOverview } from '../spending-overview/spending-overview';
import {
  billingCycles,
  DateRange,
  displayedColumns,
  FilterState,
  Subscription,
  subscriptionCategories,
} from '../subscription.model';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    // Material modules
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSortModule,
    // Angular modules
    FormsModule,
    ReactiveFormsModule,
    // Pipes
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    // Custom components
    SpendingOverview,
  ],
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.scss',
})
export class SubscriptionList implements OnInit {
  // Dependencies
  private readonly subscriptionsData = inject(SubscriptionsData);
  private readonly dialog = inject(MatDialog);
  private readonly paginator = viewChild.required(MatPaginator);
  private readonly sort = viewChild.required(MatSort);

  // Data sources
  protected readonly $subscriptions = this.subscriptionsData.$subscriptions;
  protected readonly $totalCost = this.subscriptionsData.$totalCost;

  // Filter state
  protected readonly searchTerm = signal('');
  protected readonly selectedCategory = signal('');
  protected readonly selectedBillingCycle = signal('');
  protected readonly selectedStartDate = signal<Date | null>(null);
  protected readonly selectedEndDate = signal<Date | null>(null);

  // Configuration
  protected readonly categories = subscriptionCategories;
  protected readonly billingCycles = billingCycles;
  protected readonly displayedColumns = displayedColumns;

  // Computed properties
  protected readonly $filteredSubscriptions = computed(() => {
    return this.filterSubscriptions();
  });

  protected readonly $dataSource = computed<MatTableDataSource<Subscription>>(() => {
    const subscriptions = this.$filteredSubscriptions();
    const dataSource = new MatTableDataSource<Subscription>(subscriptions);
    dataSource.paginator = this.paginator();
    dataSource.sort = this.sort();
    return dataSource;
  });

  ngOnInit(): void {
    this.subscriptionsData.loadInitialData();
  }

  // Public methods
  createSubscription(): void {
    this.openDialog(CreateSubscriptionDialog, null, (result: Omit<Subscription, 'id'>) => {
      this.subscriptionsData.addSubscription(result);
    });
  }

  updateSubscription(subscription: Subscription): void {
    this.openDialog(
      UpdateSubscriptionDialog,
      { ...subscription },
      (result: Omit<Subscription, 'id'>) => {
        this.subscriptionsData.updateSubscription({ id: subscription.id, ...result });
      },
    );
  }

  deleteSubscription({ id, serviceName }: Subscription): void {
    this.openDialog(DeleteSubscriptionDialog, { serviceName }, () => {
      this.subscriptionsData.removeSubscription(id);
    });
  }

  // Private methods
  private filterSubscriptions(): Subscription[] {
    const subscriptions = this.$subscriptions();
    const filterState = this.getFilterState();

    if (this.isFilterEmpty(filterState)) {
      return subscriptions;
    }

    return subscriptions.filter((subscription) =>
      this.matchesAllFilters(subscription, filterState),
    );
  }

  private getFilterState(): FilterState {
    return {
      searchTerm: this.searchTerm(),
      category: this.selectedCategory(),
      billingCycle: this.selectedBillingCycle(),
      dateRange: {
        start: this.selectedStartDate(),
        end: this.selectedEndDate(),
      },
    };
  }

  private isFilterEmpty(filterState: FilterState): boolean {
    return (
      !filterState.searchTerm &&
      !filterState.category &&
      !filterState.billingCycle &&
      !filterState.dateRange.start &&
      !filterState.dateRange.end
    );
  }

  private matchesAllFilters(subscription: Subscription, filterState: FilterState): boolean {
    return (
      this.matchesCategory(subscription, filterState.category) &&
      this.matchesBillingCycle(subscription, filterState.billingCycle) &&
      this.matchesSearchTerm(subscription, filterState.searchTerm) &&
      this.matchesDateRange(subscription, filterState.dateRange)
    );
  }

  private matchesCategory(subscription: Subscription, category: string): boolean {
    return !category || subscription.category === category;
  }

  private matchesBillingCycle(subscription: Subscription, billingCycle: string): boolean {
    return !billingCycle || subscription.billingCycle === billingCycle;
  }

  private matchesSearchTerm(subscription: Subscription, searchTerm: string): boolean {
    return !searchTerm || subscription.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
  }

  private matchesDateRange(subscription: Subscription, dateRange: DateRange): boolean {
    if (!dateRange.start && !dateRange.end) {
      return true;
    }

    const subscriptionDate = new Date(subscription.nextPaymentDate);

    const matchesStartDate =
      !dateRange.start || subscriptionDate >= this.normalizeToStartOfDay(new Date(dateRange.start));

    const matchesEndDate =
      !dateRange.end || subscriptionDate <= this.normalizeToEndOfDay(new Date(dateRange.end));

    return matchesStartDate && matchesEndDate;
  }

  private normalizeToStartOfDay(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  private normalizeToEndOfDay(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(23, 59, 59, 999);
    return normalized;
  }

  private openDialog<T, R>(
    dialogComponent: any,
    data: T | null,
    onSuccess: (result: R) => void,
  ): void {
    this.dialog
      .open(dialogComponent, { data })
      .afterClosed()
      .pipe(
        take(1),
        filter((result): result is R => !!result),
        tap(onSuccess),
      )
      .subscribe();
  }
}
