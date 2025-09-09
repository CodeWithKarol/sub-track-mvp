import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-subscription-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-subscription-dialog.html',
  styleUrl: './delete-subscription-dialog.scss',
})
export class DeleteSubscriptionDialog {
  private readonly dialogRef = inject(MatDialogRef<DeleteSubscriptionDialog>);
  private readonly data = inject(MAT_DIALOG_DATA);
  serviceName = computed(() => this.data?.serviceName ?? 'this service');

  confirmDeletion(): void {
    this.dialogRef.close(true);
  }
}
