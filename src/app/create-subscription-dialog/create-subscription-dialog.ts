import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  billingCycles,
  CreateSubscriptionForm,
  DEFAULT_FORM_VALUES,
  subscriptionCategories
} from '../subscription.model';

@Component({
  selector: 'app-create-subscription-dialog',
  standalone: true,
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
  // Dependencies
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateSubscriptionDialog>);

  // Form configuration
  protected readonly form = this.createForm();

  // Template data
  protected readonly categories = subscriptionCategories;
  protected readonly billingCycles = billingCycles;

  // Form creation method
  private createForm() {
    return this.fb.group({
      serviceName: [
        DEFAULT_FORM_VALUES.serviceName,
        [Validators.required, Validators.minLength(2)],
      ],
      cost: [DEFAULT_FORM_VALUES.cost, [Validators.required, Validators.min(0.01)]],
      nextPaymentDate: [DEFAULT_FORM_VALUES.nextPaymentDate, Validators.required],
      billingCycle: [DEFAULT_FORM_VALUES.billingCycle, Validators.required],
      category: [DEFAULT_FORM_VALUES.category, Validators.required],
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
  isFieldInvalid(fieldName: keyof CreateSubscriptionForm): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: keyof CreateSubscriptionForm): string | null {
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

  private getFormValue(): CreateSubscriptionForm {
    return this.form.value as CreateSubscriptionForm;
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
