import { Pipe, PipeTransform } from '@angular/core';
import { RelativeDateFormatter } from './relative-date-formatter';
import type { Subscription } from './subscription.model';

@Pipe({
  name: 'notificationMessage',
  standalone: true,
})
export class NotificationMessageFormatter implements PipeTransform {
  private readonly relativeDateFormatter = new RelativeDateFormatter();

  transform(subscription: Subscription): string {
    const relativeDate = this.relativeDateFormatter.transform(subscription.nextPaymentDate);
    return `${subscription.serviceName} • ${relativeDate} • ${subscription.cost | 0}`;
  }
}
