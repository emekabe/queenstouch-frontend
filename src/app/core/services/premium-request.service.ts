import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { PremiumServiceRequest } from '../models/premium-request.model';

@Injectable({
  providedIn: 'root'
})
export class PremiumRequestService {
  private readonly baseUrl = environment.apiUrl + '/premium-requests';
  private readonly http = inject(HttpClient);

  create(data: { serviceType: string; notes?: string }): Observable<ApiResponse<PremiumServiceRequest>> {
    return this.http.post<ApiResponse<PremiumServiceRequest>>(this.baseUrl, data);
  }

  listForUser(): Observable<ApiResponse<PremiumServiceRequest[]>> {
    return this.http.get<ApiResponse<PremiumServiceRequest[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<PremiumServiceRequest>> {
    return this.http.get<ApiResponse<PremiumServiceRequest>>(`${this.baseUrl}/${id}`);
  }

  uploadFile(id: string, file: File): Observable<ApiResponse<PremiumServiceRequest>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<PremiumServiceRequest>>(`${this.baseUrl}/${id}/upload`, formData);
  }
}
