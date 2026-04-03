import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { LinkedInProfile, GenerateLinkedInRequest } from '../models/linkedin.model';

@Injectable({
  providedIn: 'root'
})
export class LinkedInService {
  private readonly baseUrl = environment.apiUrl + '/linkedin';
  private readonly http = inject(HttpClient);

  generate(data: GenerateLinkedInRequest): Observable<ApiResponse<LinkedInProfile>> {
    return this.http.post<ApiResponse<LinkedInProfile>>(`${this.baseUrl}/generate`, data);
  }

  list(): Observable<ApiResponse<LinkedInProfile[]>> {
    return this.http.get<ApiResponse<LinkedInProfile[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<LinkedInProfile>> {
    return this.http.get<ApiResponse<LinkedInProfile>>(`${this.baseUrl}/${id}`);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
