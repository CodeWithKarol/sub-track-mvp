import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { billingCycles, subscriptionCategories } from '../subscription.model';

@Component({
  selector: 'app-update-subscription-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './update-subscription-dialog.html',
  styleUrl: './update-subscription-dialog.scss',
})
export class UpdateSubscriptionDialog {
  private readonly dialogRef = inject(MatDialogRef<UpdateSubscriptionDialog>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  protected readonly billingCycles = billingCycles;
  protected selectedBillingCycle = signal(this.data?.billingCycle ?? 'monthly');
  protected selectedCategory = signal(this.data?.category ?? 'Entertainment');
  protected readonly categories = subscriptionCategories;
  protected form = this.fb.group({
    serviceName: [this.data?.serviceName, Validators.required],
    cost: [this.data?.cost, [Validators.required, Validators.min(0)]],
    nextPaymentDate: [new Date(this.data?.nextPaymentDate), Validators.required],
    billingCycle: [this.data?.billingCycle, Validators.required],
    category: [this.data?.category, Validators.required],
  });

  confirmUpdate(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
