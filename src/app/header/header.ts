import { Component, inject, computed } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyPipe } from '@angular/common';

import { SubscriptionsData } from '../subscriptions-data';
import type { Subscription } from '../subscription.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    CurrencyPipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly subscriptionsData = inject(SubscriptionsData);

  // Computed signals for reactive data
  protected readonly $dueSubscriptions = this.subscriptionsData.$dueSubscriptions;
  protected readonly $numOfDueSubscriptions = this.subscriptionsData.$numOfDueSubscriptions;

  // Computed for notification badge state
  protected readonly $hasNotifications = computed(() => this.$numOfDueSubscriptions() > 0);

  // Computed for notification badge display text
  protected readonly $notificationBadgeText = computed(() => {
    const count = this.$numOfDueSubscriptions();
    return count > 99 ? '99+' : count.toString();
  });

  // Template event handlers
  onBrandClick(): void {
    // Future: Navigate to dashboard or trigger brand action
    console.log('Brand clicked - potential navigation to dashboard');
  }

  onNotificationMenuOpened(): void {
    // Future: Mark notifications as viewed
    console.log('Notification menu opened');
  }

  // Template utility methods
  trackBySubscriptionId = (index: number, subscription: Subscription): string => subscription.id;

  formatNotificationMessage(subscription: Subscription): string {
    const date = subscription.nextPaymentDate;
    const relativeDate = this.getRelativeDate(date);
    return `${subscription.serviceName} • ${relativeDate} • ${subscription.cost | 0}`;
  }

  protected getRelativeDate(date: Date): string {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return 'Due yesterday';
    if (diffDays > 1) return `Due in ${diffDays} days`;
    return `Overdue by ${Math.abs(diffDays)} days`;
  }
}
