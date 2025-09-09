import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { SubscriptionsData } from '../subscriptions-data';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly subscriptionsData = inject(SubscriptionsData);
  protected $numOfDueSubscriptions = this.subscriptionsData.$numOfDueSubscriptions;
  protected $dueSubscriptions = this.subscriptionsData.$dueSubscriptions;
}
