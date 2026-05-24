import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductRequest, Product, ProductPaginationRequest, ProductPaginationResponse, UpdateProductRequest } from '../../models/product-model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Injects
  private http = inject(HttpClient);

  // Functions
  getPaginationProducts(query: ProductPaginationRequest): Observable<ProductPaginationResponse> {
    let params = new HttpParams()
      .set('orderBy', query.orderBy)
      .set('orderDirection', query.orderDirection)
      .set('pageSize', query.pageSize)
      .set('pageNumber', query.pageNumber);

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.categories && query.categories.length > 0) {
      query.categories.forEach(categoryId => {
        params = params.append('categories', categoryId);
      });
    }

    return this.http.get<ProductPaginationResponse>(`${environment.apiBaseUrl}/api/product`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiBaseUrl}/api/product/${id}`);
  }

  createProduct(payload: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${environment.apiBaseUrl}/api/product`, payload);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/product/${id}`);
  }

  updateProduct(id: string, payload: UpdateProductRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiBaseUrl}/api/product/${id}`, payload);
  }
}
