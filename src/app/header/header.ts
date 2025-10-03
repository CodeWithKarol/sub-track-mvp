import { Component, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyPipe } from '@angular/common';

import { SubscriptionsData } from '../subscriptions-data';
import { RelativeDateFormatter } from '../relative-date-formatter';
import { NotificationMessageFormatter } from '../notification-message-formatter';

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
    RelativeDateFormatter,
    NotificationMessageFormatter,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly subscriptionsData = inject(SubscriptionsData);

  // Computed signals for reactive data
  protected $dueSubscriptions = computed(() => this.subscriptionsData.$dueSubscriptions());
  protected $numOfDueSubscriptions = computed(() =>
    this.subscriptionsData.$numOfDueSubscriptions(),
  );

  // Computed for notification badge state
  protected $hasNotifications = computed(() => this.$numOfDueSubscriptions() > 0);

  // Computed for notification badge display text
  protected $notificationBadgeText = computed(() => {
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
}
