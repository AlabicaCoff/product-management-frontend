import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../core/models/product-model';

@Component({
  selector: 'app-view-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-product.html',
  styleUrl: './view-product.css',
})
export class ViewProductModal {
  @Input() product: Product | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  closeModal(): void {
    this.close.emit();
  }

  onEdit(): void {
    if (this.product) this.edit.emit(this.product);
  }

  onDelete(): void {
    if (this.product) this.delete.emit(this.product);
  }
}
