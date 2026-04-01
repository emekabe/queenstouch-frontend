import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CoverLetter } from '../models/cover-letter.model';

@Injectable({
  providedIn: 'root'
})
export class CoverLetterService {
  private readonly baseUrl = environment.apiUrl + '/cover-letters';
  private readonly http = inject(HttpClient);

  create(data: any): Observable<ApiResponse<CoverLetter>> {
    return this.http.post<ApiResponse<CoverLetter>>(this.baseUrl, data);
  }

  list(): Observable<ApiResponse<CoverLetter[]>> {
    return this.http.get<ApiResponse<CoverLetter[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<CoverLetter>> {
    return this.http.get<ApiResponse<CoverLetter>>(`${this.baseUrl}/${id}`);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  download(id: string, format: 'PDF' | 'DOCX'): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download?format=${format}`, { responseType: 'blob' });
  }
}
