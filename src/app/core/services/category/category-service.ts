import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../models/category-model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Injects
  private http = inject(HttpClient);

  // Functions
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/category`);
  }

  createCategory(payload: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${environment.apiBaseUrl}/api/category`, payload);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/category/${id}`);
  }

  updateCategory(id: string, payload: UpdateCategoryRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiBaseUrl}/api/category/${id}`, payload);
  }
}

