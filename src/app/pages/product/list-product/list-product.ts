import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Product,
  ProductPaginationRequest,
  OrderBy,
  OrderDirection,
  ProductPaginationResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from '../../../core/models/product-model';
import { ProductService } from '../../../core/services/product/product-service';
import { CategoryService } from '../../../core/services/category/category-service';
import { Category } from '../../../core/models/category-model';
import { ComfirmModal } from '../../../shared/components/comfirm-modal/comfirm-modal';
import { AddProductModal } from './components/add-product/add-product';
import { EditProductModal } from './components/edit-product/edit-product';
import { ViewProductModal } from './components/view-product/view-product';
import { AuthService } from '../../../core/services/auth/auth-service';
import { ImageResponse } from '../../../core/models/image-model';
import { ImageService } from '../../../core/services/image/image-service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComfirmModal,
    AddProductModal,
    EditProductModal,
    ViewProductModal,
  ],
  templateUrl: './list-product.html',
  styleUrl: './list-product.css',
})
export class ListProduct implements OnInit {
  // Variables
  products: Product[] = [];
  categoriesList: Category[] = [];
  isLoading = signal(false);
  errorMessage: string = '';
  successMessage: string = '';

  // user permission
  isAdmin = signal(false);

  // Enums for template
  OrderByEnum = OrderBy;
  OrderDirectionEnum = OrderDirection;

  // Pagination & Filter state
  paginationRequest: ProductPaginationRequest = {
    orderBy: OrderBy.createdDate,
    orderDirection: OrderDirection.DESC,
    pageSize: 10,
    pageNumber: 1,
    search: '',
    categories: [],
  };
  totalCount: number = 0;
  totalPages: number = 0;

  // Delete modal state
  showDeleteModal: boolean = false;
  productToDelete: Product | null = null;
  isDeleting = signal(false);

  // Add modal state
  showAddModal: boolean = false;
  addForm: CreateProductRequest = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryIds: [],
  };
  isAdding = signal(false);
  addErrorMessage: string = '';

  // Edit modal state
  showEditModal: boolean = false;
  productToEdit: Product | null = null;
  editForm: UpdateProductRequest = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryIds: [],
  };
  isUpdating = signal(false);
  editErrorMessage: string = '';

  // View modal state
  showViewModal: boolean = false;
  productToView: Product | null = null;

  // Image upload state
  uploadedFile = signal<File | null>(null);

  // Dropdown state
  dropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getCategoryName(id: string): string {
    const cat = this.categoriesList.find((c) => c.id === id);
    return cat ? cat.name : 'Unknown';
  }

  // Injects
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private imageService = inject(ImageService);

  // Lifecycle
  ngOnInit(): void {
    this.getAvailableCategories();
    this.getProducts();
    this.isAdmin.set(this.authService.isAdmin());
  }

  // --- Data Fetching ---
  getAvailableCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => {
        this.categoriesList = cats;
      },
      error: () => {
        console.error('Failed to load categories');
      },
    });
  }

  getProducts(): void {
    this.isLoading.set(true);
    this.errorMessage = '';
    this.productService.getPaginationProducts(this.paginationRequest).subscribe({
      next: (response: ProductPaginationResponse) => {
        this.products = response.products;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage = 'Failed to load products. Please try again.';
        this.isLoading.set(false);
      },
    });
  }

  onSearch(): void {
    this.paginationRequest.pageNumber = 1;
    this.getProducts();
  }

  toggleCategory(categoryId: string): void {
    const idx = this.paginationRequest.categories.indexOf(categoryId);
    if (idx > -1) {
      this.paginationRequest.categories.splice(idx, 1);
    } else {
      this.paginationRequest.categories.push(categoryId);
    }
    this.paginationRequest.pageNumber = 1; // Reset to page 1
    this.getProducts();
  }

  sortBy(column: OrderBy): void {
    if (this.paginationRequest.orderBy === column) {
      // Toggle direction
      this.paginationRequest.orderDirection =
        this.paginationRequest.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
    } else {
      // New column, default to ASC (or DESC if createdDate/updatedDate)
      this.paginationRequest.orderBy = column;
      this.paginationRequest.orderDirection =
        column === OrderBy.createdDate || column === OrderBy.updatedDate
          ? OrderDirection.DESC
          : OrderDirection.ASC;
    }
    this.paginationRequest.pageNumber = 1; // Reset to page 1
    this.getProducts();
  }

  nextPage(): void {
    if (this.paginationRequest.pageNumber < this.totalPages) {
      this.paginationRequest.pageNumber++;
      this.getProducts();
    }
  }

  prevPage(): void {
    if (this.paginationRequest.pageNumber > 1) {
      this.paginationRequest.pageNumber--;
      this.getProducts();
    }
  }

  onPageSizeChange(): void {
    this.paginationRequest.pageNumber = 1;
    this.getProducts();
  }

  // --- Delete Flow ---
  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;
    this.isDeleting.set(true);
    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.showSuccess('Product deleted successfully.');
        this.getProducts(); // Refresh list after deletion
      },
      error: () => {
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.errorMessage = 'Failed to delete product. Please try again.';
      },
    });
  }

  // --- Add Flow ---
  openAddModal(): void {
    this.showAddModal = true;
    this.addErrorMessage = '';
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.isAdding.set(false);
  }

  confirmAdd(request: CreateProductRequest): void {
    this.isAdding.set(true);
    this.addErrorMessage = '';

    const createProduct = () => {
      this.productService.createProduct(request).subscribe({
        next: () => {
          this.isAdding.set(false);
          this.closeAddModal();
          this.showSuccess('Product added successfully!');
          this.getProducts();
        },
        error: (err) => {
          this.isAdding.set(false);
          this.addErrorMessage = 'Failed to add product.';
          console.error('Add failed', err);
        },
      });
    };

    if (this.uploadedFile()) {
      this.imageService.uploadImage(this.uploadedFile()!).subscribe({
        next: (res: ImageResponse) => {
          if (res.isSuccess) {
            request.imageUrl = res.imageUrl;
            createProduct();
          } else {
            this.isAdding.set(false);
            this.addErrorMessage = 'Failed to upload image.';
          }
        },
        error: (err: any) => {
          this.isAdding.set(false);
          this.addErrorMessage = 'Failed to upload image.';
          console.error('Image upload failed', err);
        },
      });
    } else {
      createProduct();
    }
  }

  // --- Edit Flow ---
  openEditModal(product: Product): void {
    this.productToEdit = product;

    // Map category names back to IDs if necessary
    const mappedIds =
      product.categories?.map((cat) => {
        const matchByName = this.categoriesList.find((c) => c.name === cat);
        return matchByName ? matchByName.id : cat;
      }) || [];

    this.editForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryIds: mappedIds,
      imageUrl: product.imageUrl,
    };

    this.showEditModal = true;
    this.editErrorMessage = '';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.productToEdit = null;
    this.isUpdating.set(false);
  }

  confirmEdit(request: UpdateProductRequest): void {
    if (!this.productToEdit) return;

    this.isUpdating.set(true);
    this.editErrorMessage = '';

    const updateProduct = () => {
      this.productService.updateProduct(this.productToEdit!.id, request).subscribe({
        next: () => {
          this.isUpdating.set(false);
          this.closeEditModal();
          this.showSuccess('Product updated successfully!');
          this.getProducts();
        },
        error: (err) => {
          this.isUpdating.set(false);
          this.editErrorMessage = 'Failed to update product.';
          console.error('Update failed', err);
        },
      });
    };

    if (this.uploadedFile()) {
      this.imageService.uploadImage(this.uploadedFile()!).subscribe({
        next: (res: ImageResponse) => {
          if (res.isSuccess) {
            request.imageUrl = res.imageUrl;
            updateProduct();
          } else {
            this.isUpdating.set(false);
            this.editErrorMessage = 'Failed to upload image.';
          }
        },
        error: (err: any) => {
          this.isUpdating.set(false);
          this.editErrorMessage = 'Failed to upload image.';
          console.error('Image upload failed', err);
        },
      });
    } else {
      updateProduct();
    }
  }

  // --- View Flow ---
  openViewModal(product: Product): void {
    this.productToView = product;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.productToView = null;
  }

  // --- Image Upload Flow ---
  onImageUpload(file: File | null): void {
    this.uploadedFile.set(file);
  }

  // --- Helpers ---
  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3500);
  }
}
