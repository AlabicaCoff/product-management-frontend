import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UpdateProductRequest } from '../../../../../core/models/product-model';
import { Category } from '../../../../../core/models/category-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProductModal implements OnChanges {
  @Input() isUpdating: boolean = false;
  @Input() editForm!: UpdateProductRequest;
  @Input() categoriesList: Category[] = [];

  @Output() confirmEditEvent = new EventEmitter<UpdateProductRequest>();
  @Output() closeEditModalEvent = new EventEmitter<void>();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl(''),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    categoryIds: new FormControl<string[]>([]),
  });

  dropdownOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editForm'] && this.editForm) {
      this.form.patchValue({
        name: this.editForm.name,
        description: this.editForm.description,
        price: this.editForm.price,
        stock: this.editForm.stock,
        categoryIds: this.editForm.categoryIds || [],
      });
    }
  }

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

  confirmEdit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.confirmEditEvent.emit(this.form.value as UpdateProductRequest);
  }

  closeEditModal(): void {
    this.closeEditModalEvent.emit();
    this.dropdownOpen = false;
  }
}
