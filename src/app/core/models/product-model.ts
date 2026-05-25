export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdDate: string;
  updatedDate: string;
  categories: string[];
  imageUrl?: string;
}

interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryIds: string[];
  imageUrl?: string;
}

export interface CreateProductRequest extends ProductRequest {}

export interface UpdateProductRequest extends ProductRequest {}

export enum OrderBy { id = 0, name = 1, price = 2, stock = 3, createdDate = 4, updatedDate = 5 };
export enum OrderDirection { ASC = 0, DESC = 1 };

export interface ProductPaginationRequest {
  orderBy: OrderBy;
  orderDirection: OrderDirection;
  search?: string;
  pageSize: number;
  pageNumber: number;
  categories: string[];
}

export interface ProductPaginationResponse {
  products: Product[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
