import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Order } from '../../../core/models/order.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NairaPipe } from '../../../shared/pipes/naira.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent, NavbarComponent, NairaPipe],
  template: `
    <app-navbar></app-navbar>
    <div class="container py-5 min-vh-100">
      <app-spinner [show]="isLoading"></app-spinner>

      <div class="mb-4">
        <h2>Order History</h2>
        <p class="text-muted">Track your recent purchases and their statuses.</p>
      </div>

      <div class="card p-0 shadow-sm border-none overflow-hidden">
        <table class="table mb-0">
          <thead class="bg-secondary">
            <tr>
              <th>Order ID</th>
              <th>Services</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders; track order) {
              <tr>
                <td>
                  <span class="small text-muted">{{ order.id }}</span>
                </td>
                <td class="fw-500">
                  @for (item of order.items; track item) {
                    <div class="small">{{ item.label }}</div>
                  }
                </td>
                <td>{{ order.totalAmountNgn | naira }}</td>
                <td>
                  <span
                    class="badge"
                    [ngClass]="{
                      'badge-success': order.status === 'PAID',
                      'badge-warning': order.status === 'PENDING',
                    }"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ order.createdAt | date: 'medium' }}</td>
              </tr>
            }
            @if (orders.length === 0 && !isLoading) {
              <tr>
                <td colspan="5" class="text-center py-4 text-muted">No orders found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1000px;
        margin: 0 auto;
      }
      .min-vh-100 {
        min-height: 100vh;
      }
      .py-5 {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .p-0 {
        padding: 0 !important;
      }
      .mb-0 {
        margin-bottom: 0 !important;
      }
      .py-4 {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
      }
      .shadow-sm {
        box-shadow: var(--box-shadow-sm);
      }
      .border-none {
        border: none;
      }
      .overflow-hidden {
        overflow: hidden;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table th,
      .table td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
        text-align: left;
      }
      .table th {
        font-weight: 600;
        color: var(--qt-navy);
      }
      .bg-secondary {
        background-color: var(--qt-bg-secondary);
      }
      .fw-500 {
        font-weight: 500;
      }
      .small {
        font-size: 0.875rem;
      }

      .badge {
        padding: 0.25rem 0.6rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
        background: var(--qt-navy);
      }
      .badge-success {
        background: var(--qt-success);
      }
      .badge-warning {
        background: var(--qt-warning);
      }
    `,
  ],
})
export class OrderHistoryComponent implements OnInit {
  orderService = inject(OrderService);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];
  isLoading = false;

  ngOnInit() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.orderService.listForUser().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.orders = res.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load order history.');
      },
    });
  }
}
