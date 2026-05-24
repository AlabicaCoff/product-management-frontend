import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateCategoryRequest } from '../../../../../core/models/category-model';

@Component({
  selector: 'app-add-category-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category-modal.html',
  styleUrl: './add-category-modal.css',
})
export class AddCategoryModal {
  /** Passed from parent to disable buttons while the API call is in-flight */
  @Input() isAdding: boolean = false;

  @Output() confirmAddEvent = new EventEmitter<CreateCategoryRequest>();
  @Output() closeAddModalEvent = new EventEmitter<void>();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl(''),
  });

  confirmAdd(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.confirmAddEvent.emit(this.form.value as CreateCategoryRequest);
  }

  closeAddModal(): void {
    this.closeAddModalEvent.emit();
    this.form.reset();
  }
}
