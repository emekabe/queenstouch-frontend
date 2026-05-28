import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Order, CreateOrderResponse } from '../models/order.model';
import { PricingConfig } from '../models/pricing-config.model';
import { CreateOrderRequest } from '../models/order-request.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = environment.apiUrl + '/orders';
  private readonly http = inject(HttpClient);

  getPricingCatalogue(): Observable<ApiResponse<PricingConfig[]>> {
    return this.http.get<ApiResponse<PricingConfig[]>>(`${this.baseUrl}/pricing`);
  }

  createOrder(data: CreateOrderRequest): Observable<ApiResponse<CreateOrderResponse>> {
    return this.http.post<ApiResponse<CreateOrderResponse>>(this.baseUrl, data);
  }

  verifyPayment(reference: string): Observable<ApiResponse<void>> {
    return this.http.get<ApiResponse<void>>(`${this.baseUrl}/verify-payment?reference=${reference}`);
  }

  listForUser(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/${id}`);
  }
}
