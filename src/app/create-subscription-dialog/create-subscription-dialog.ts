import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-create-subscription-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './create-subscription-dialog.html',
  styleUrl: './create-subscription-dialog.scss',
})
export class CreateSubscriptionDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateSubscriptionDialog>);
  protected form = this.fb.group({
    serviceName: ['', Validators.required],
    cost: [0, [Validators.required, Validators.min(0)]],
    nextPaymentDate: [new Date(), Validators.required],
    billingCycle: ['monthly', Validators.required],
    category: ['Entertainment', Validators.required],
  });
  protected selectedBillingCycle = signal('monthly');
  protected selectedCategory = signal('Entertainment');
  protected readonly categories = [
    { value: 'Entertainment', viewValue: 'Entertainment' },
    { value: 'Music', viewValue: 'Music' },
    { value: 'Productivity', viewValue: 'Productivity' },
    { value: 'Shopping', viewValue: 'Shopping' },
  ];
  protected billingCycles = [
    { value: 'monthly', viewValue: 'Monthly' },
    { value: 'yearly', viewValue: 'Yearly' },
  ];

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.value);
  }
}
