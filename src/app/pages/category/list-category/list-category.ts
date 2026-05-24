import { Component, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../core/models/category-model';
import { CategoryService } from '../../../core/services/category/category-service';
import { EditCategoryModal } from "./components/edit-category-modal/edit-category-modal";
import { ComfirmModal } from '../../../shared/components/comfirm-modal/comfirm-modal';
import { AddCategoryModal } from './components/add-category-modal/add-category-modal';

@Component({
  selector: 'app-list-category',
  imports: [CommonModule, FormsModule, EditCategoryModal, ComfirmModal, AddCategoryModal],
  templateUrl: './list-category.html',
  styleUrl: './list-category.css',
})
export class ListCategory {
  // Variables
  categories: Category[] = [];
  isLoading = signal(false);
  errorMessage: string = '';
  successMessage: string = '';

  // Delete modal state
  showDeleteModal: boolean = false;
  categoryToDelete: Category | null = null;
  isDeleting = signal(false);

  // Add modal state
  showAddModal: boolean = false;
  addForm: CreateCategoryRequest = { name: '', description: '' };
  isAdding = signal(false);
  addErrorMessage: string = '';

  // Edit modal state
  showEditModal: boolean = false;
  categoryToEdit: Category | null = null;
  editForm: UpdateCategoryRequest  = { name: '', description: '' };
  isUpdating = signal(false);
  editErrorMessage: string = '';

  // Injects
  private categoryService = inject(CategoryService);

  // Lifecycle
  ngOnInit(): void {
    this.getAllCategories();
  }

  // --- Data Fetching ---
  private getAllCategories(): void {
    this.isLoading.set(true);
    this.errorMessage = '';
    this.categoryService.getAllCategories().subscribe({
      next: (response: Category[]) => {
        this.categories = response;
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.isLoading.set(false);
      },
    });
  }

  // --- Delete Flow ---
  openDeleteModal(category: Category): void {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  confirmDelete(): void {
    if (!this.categoryToDelete) return;
    this.isDeleting.set(true);
    this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: () => {
        this.categories = this.categories.filter(
          (c) => c.id !== this.categoryToDelete!.id
        );
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.showSuccess('Category deleted successfully.');
      },
      error: () => {
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.errorMessage = 'Failed to delete category. Please try again.';
      },
    });
  }

  // --- Add Flow ---
  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  confirmAdd(payload: CreateCategoryRequest): void {
    this.isAdding.set(true);
    this.categoryService.createCategory(payload).subscribe({
      next: (created: Category) => {
        this.categories.push(created);
        this.isAdding.set(false);
        this.closeAddModal();
        this.showSuccess('Category added successfully.');
      },
      error: () => {
        this.isAdding.set(false);
        this.errorMessage = 'Failed to add category. Please try again.';
      },
    });
  }

  // --- Edit Flow ---
  openEditModal(category: Category): void {
    this.categoryToEdit = category;
    this.editForm = { name: category.name, description: category.description };
    this.editErrorMessage = '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.categoryToEdit = null;
    this.editErrorMessage = '';
  }

  confirmEdit(editForm: UpdateCategoryRequest): void {
    if (!this.categoryToEdit) return;
    this.isUpdating.set(true);
    this.categoryService
      .updateCategory(this.categoryToEdit.id, editForm)
      .subscribe({
        next: () => {
          const idx = this.categories.findIndex(
            (c) => c.id === this.categoryToEdit!.id
          );
          if (idx !== -1) {
            this.categories[idx] = { ...this.categories[idx], ...editForm };
          }
          this.isUpdating.set(false);
          this.closeEditModal();
          this.showSuccess('Category updated successfully.');
        },
        error: () => {
          this.editErrorMessage = 'Failed to update category. Please try again.';
          this.isUpdating.set(false);
        },
      });
  }

  // --- Helpers ---
  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3500);
  }
}
