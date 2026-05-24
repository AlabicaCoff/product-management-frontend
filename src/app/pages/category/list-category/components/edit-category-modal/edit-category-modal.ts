import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UpdateCategoryRequest } from '../../../../../core/models/category-model';

@Component({
  selector: 'app-edit-category-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category-modal.html',
  styleUrl: './edit-category-modal.css',
})
export class EditCategoryModal implements OnChanges {
  @Input() editForm!: { name: string; description: string };
  @Input() isUpdating: boolean = false;

  @Output() confirmEditEvent = new EventEmitter<UpdateCategoryRequest>();
  @Output() closeEditModalEvent = new EventEmitter<void>();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl(''),
  });

  // Populate the form whenever the parent passes in a new category to edit
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editForm'] && this.editForm) {
      this.form.patchValue({
        name: this.editForm.name,
        description: this.editForm.description ?? '',
      });
    }
  }

  confirmEdit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.confirmEditEvent.emit(this.form.value as UpdateCategoryRequest);
  }

  closeEditModal(): void {
    this.closeEditModalEvent.emit();
    this.form.reset();
  }
}
