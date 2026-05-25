import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ImageResponse } from '../../models/image-model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // Injects
  private http = inject(HttpClient);

  // Functions
  uploadImage(file: File): Observable<ImageResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<ImageResponse>(`${environment.apiBaseUrl}/api/image/upload`, formData);
  }
}
