import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateProductRequest } from '../../../../../core/models/product-model';
import { Category } from '../../../../../core/models/category-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProductModal {
  @Input() isAdding: boolean = false;
  @Input() categoriesList: Category[] = [];

  @Output() confirmAddEvent = new EventEmitter<CreateProductRequest>();
  @Output() closeAddModalEvent = new EventEmitter<void>();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl(''),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    categoryIds: new FormControl<string[]>([]),
  });

  dropdownOpen = false;

  onCategoryChange(event: any, categoryId: string) {
    const categoryIds = this.form.get('categoryIds') as FormControl;
    const currentValues = categoryIds.value as string[];
    if (event.target.checked) {
      categoryIds.setValue([...currentValues, categoryId]);
    } else {
      categoryIds.setValue(currentValues.filter(id => id !== categoryId));
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getCategoryName(id: string): string {
    return this.categoriesList.find(c => c.id === id)?.name || id;
  }

  confirmAdd(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.confirmAddEvent.emit(this.form.value as CreateProductRequest);
  }

  closeAddModal(): void {
    this.closeAddModalEvent.emit();
    this.form.reset({ price: 0, stock: 0, categoryIds: [] });
    this.dropdownOpen = false;
  }
}
