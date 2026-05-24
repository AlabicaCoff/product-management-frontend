import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ConfirmModalVariant = 'danger' | 'warning' | 'primary';

@Component({
  selector: 'app-comfirm-modal',
  imports: [CommonModule],
  templateUrl: './comfirm-modal.html',
  styleUrl: './comfirm-modal.css',
})
export class ComfirmModal {
  /** Modal heading text */
  @Input() title: string = 'Are you sure?';

  /** Body message — supports a short HTML string via [innerHTML] if needed */
  @Input() message: string = 'This action cannot be undone.';

  /** Label shown on the confirm button */
  @Input() confirmLabel: string = 'Confirm';

  /** Bootstrap-Icons class for the icon shown in the modal header circle */
  @Input() iconClass: string = 'bi bi-exclamation-triangle-fill';

  /** Visual variant that controls colour of icon + confirm button */
  @Input() variant: ConfirmModalVariant = 'danger';

  /** When true the confirm button shows a spinner and both buttons are disabled */
  @Input() isLoading: boolean = false;

  /** Emitted when the user clicks the confirm button */
  @Output() confirmed = new EventEmitter<void>();

  /** Emitted when the user clicks Cancel or the backdrop */
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    if (this.isLoading) return;
    this.confirmed.emit();
  }

  onCancel(): void {
    if (this.isLoading) return;
    this.cancelled.emit();
  }
}
