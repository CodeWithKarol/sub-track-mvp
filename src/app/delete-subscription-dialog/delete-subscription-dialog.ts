import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DeleteSubscriptionDialogData } from '../subscription.model';

@Component({
  selector: 'app-delete-subscription-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-subscription-dialog.html',
  styleUrl: './delete-subscription-dialog.scss',
})
export class DeleteSubscriptionDialog {
  // Dependencies
  private readonly dialogRef = inject(MatDialogRef<DeleteSubscriptionDialog>);
  private readonly data = inject<DeleteSubscriptionDialogData>(MAT_DIALOG_DATA);

  // Computed properties
  protected readonly serviceName = computed(() => this.data?.serviceName ?? 'this service');

  // Public methods
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
