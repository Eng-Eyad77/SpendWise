import { Component, Inject } from '@angular/core';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.scss'],
  standalone: false
})
export class ConfirmationDialogComponent {
  data: ConfirmationDialogData;

  constructor(@Inject('dialogData') data: ConfirmationDialogData) {
    this.data = {
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      ...data
    };
  }

  onConfirm(): void {
    // Dialog will be closed by parent component
  }

  onCancel(): void {
    // Dialog will be closed by parent component
  }
}
