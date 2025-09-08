import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SubscriptionsData } from '../subscriptions-data';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSubscriptionDialog } from '../delete-subscription-dialog/delete-subscription-dialog';
import { UpdateSubscriptionDialog } from '../update-subscription-dialog/update-subscription-dialog';
import { CreateSubscriptionDialog } from '../create-subscription-dialog/create-subscription-dialog';

@Component({
  selector: 'app-subscription-list',
  imports: [MatCardModule, MatButtonModule, CurrencyPipe, DatePipe],
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.scss',
})
export class SubscriptionList {
  private readonly subscriptionsData = inject(SubscriptionsData);
  private readonly dialog = inject(MatDialog);
  readonly $subscriptions = this.subscriptionsData.$subscriptions;
  readonly $totalCost = this.subscriptionsData.$totalCost;

  deleteSubscription(id: string): void {
    this.dialog.open(DeleteSubscriptionDialog);
  }

  updateSubscription(id: string): void {
    this.dialog.open(UpdateSubscriptionDialog);
  }

  createSubscription(): void {
    this.dialog.open(CreateSubscriptionDialog);
  }
}
