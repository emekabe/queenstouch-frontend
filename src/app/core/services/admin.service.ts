import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { PremiumServiceRequest } from '../models/premium-request.model';
import { PricingConfig } from '../models/pricing-config.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = environment.apiUrl + '/admin';
  private readonly http = inject(HttpClient);

  getStats(): Observable<ApiResponse<{totalUsers: number; totalOrders: number; totalPremiumRequests: number}>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats`);
  }

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/users`);
  }

  getOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/orders`);
  }

  getPremiumRequests(): Observable<ApiResponse<PremiumServiceRequest[]>> {
    return this.http.get<ApiResponse<PremiumServiceRequest[]>>(`${this.baseUrl}/premium-requests`);
  }

  updatePremiumRequestStatus(id: string, data: { status: string; adminNotes?: string }): Observable<ApiResponse<PremiumServiceRequest>> {
    return this.http.put<ApiResponse<PremiumServiceRequest>>(`${this.baseUrl}/premium-requests/${id}/status`, data);
  }

  deliverPremiumCV(id: string, file: File, notes: string): Observable<ApiResponse<PremiumServiceRequest>> {
    const formData = new FormData();
    formData.append('file', file);
    if (notes) formData.append('notes', notes);
    return this.http.post<ApiResponse<PremiumServiceRequest>>(`${this.baseUrl}/premium-requests/${id}/deliver`, formData);
  }

  getRecentActivity(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/recent-activity`);
  }

  getAllPricing(): Observable<ApiResponse<PricingConfig[]>> {
    return this.http.get<ApiResponse<PricingConfig[]>>(`${this.baseUrl}/pricing`);
  }

  updatePricing(serviceKey: string, data: { minPrice: number; maxPrice: number }): Observable<ApiResponse<PricingConfig>> {
    return this.http.put<ApiResponse<PricingConfig>>(`${this.baseUrl}/pricing/${serviceKey}`, data);
  }
}
