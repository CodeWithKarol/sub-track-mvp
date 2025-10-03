import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  type BillingCycle,
  billingCycles,
  type Subscription,
  subscriptionCategories,
  type SubscriptionCategory,
} from '../subscription.model';

// Form interface for type safety
interface UpdateSubscriptionForm {
  serviceName: string;
  cost: number;
  nextPaymentDate: Date;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
}

@Component({
  selector: 'app-update-subscription-dialog',
  standalone: true,
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
  // Dependencies
  private readonly dialogRef = inject(MatDialogRef<UpdateSubscriptionDialog>);
  private readonly data = inject<Subscription>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  // Form configuration
  protected readonly form = this.createForm();

  // Template data
  protected readonly categories = subscriptionCategories;
  protected readonly billingCycles = billingCycles;

  // Form creation method
  private createForm() {
    return this.fb.group({
      serviceName: [this.data?.serviceName || '', [Validators.required, Validators.minLength(2)]],
      cost: [this.data?.cost || 0, [Validators.required, Validators.min(0.01)]],
      nextPaymentDate: [
        this.data?.nextPaymentDate ? new Date(this.data.nextPaymentDate) : new Date(),
        Validators.required,
      ],
      billingCycle: [this.data?.billingCycle || 'monthly', Validators.required],
      category: [this.data?.category || 'Entertainment', Validators.required],
    });
  }

  // Public methods
  onSubmit(): void {
    if (!this.isFormValid()) {
      this.markFormAsTouched();
      return;
    }

    const formValue = this.getFormValue();
    this.dialogRef.close(formValue);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Form validation helpers
  isFieldInvalid(fieldName: keyof UpdateSubscriptionForm): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: keyof UpdateSubscriptionForm): string | null {
    const field = this.form.get(fieldName);

    if (!field || !this.isFieldInvalid(fieldName)) {
      return null;
    }

    const errors = field.errors;
    if (!errors) return null;

    return this.getErrorMessage(fieldName, errors);
  }

  // Private helper methods
  private isFormValid(): boolean {
    return this.form.valid;
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
  }

  private getFormValue(): UpdateSubscriptionForm {
    return this.form.value as UpdateSubscriptionForm;
  }

  private getErrorMessage(fieldName: string, errors: any): string {
    if (errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }

    if (errors['minLength']) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['minLength'].requiredLength} characters`;
    }

    if (errors['min']) {
      return `${this.getFieldDisplayName(fieldName)} must be greater than ${errors['min'].min}`;
    }

    return `${this.getFieldDisplayName(fieldName)} is invalid`;
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      serviceName: 'Service name',
      cost: 'Cost',
      nextPaymentDate: 'Next payment date',
      billingCycle: 'Billing cycle',
      category: 'Category',
    };

    return displayNames[fieldName] || fieldName;
  }
}
