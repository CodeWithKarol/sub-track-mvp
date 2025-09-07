import { Component } from '@angular/core';
import { Header } from './header/header';
import { SubscriptionList } from './subscription-list/subscription-list';

@Component({
  selector: 'app-root',
  imports: [Header, SubscriptionList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
