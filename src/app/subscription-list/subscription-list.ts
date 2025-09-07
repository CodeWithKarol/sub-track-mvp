import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SubscriptionsData } from '../subscriptions-data';

@Component({
  selector: 'app-subscription-list',
  imports: [MatCardModule, MatButtonModule, CurrencyPipe, DatePipe],
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.scss',
})
export class SubscriptionList {
  private readonly subscriptionsData = inject(SubscriptionsData);
  readonly $subscriptions = this.subscriptionsData.$subscriptions;
  readonly $totalCost = this.subscriptionsData.$totalCost;
}
