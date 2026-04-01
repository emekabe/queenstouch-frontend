import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NairaPipe } from '../../../shared/pipes/naira.pipe';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, NairaPipe],
  template: `
    <div class="container-fluid py-2">
      <app-spinner [show]="isLoading"></app-spinner>
      
      <div class="mb-4">
        <h3 class="mb-0 text-navy">All Orders</h3>
      </div>

      <div class="card p-0 shadow-sm border-none overflow-hidden bg-white">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th>Order ID</th>
              <th>User Email</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td><span class="small text-muted">{{ order.id }}</span></td>
              <td class="fw-500">{{ order.userEmail }}</td>
              <td>{{ order.itemType }}</td>
              <td>{{ order.amount | naira }}</td>
              <td>
                <span class="badge" 
                  [ngClass]="{
                    'badge-success': order.status === 'PAID',
                    'badge-warning': order.status === 'PENDING'
                  }">
                  {{ order.status }}
                </span>
              </td>
              <td>{{ order.createdAt | date:'medium' }}</td>
            </tr>
            <tr *ngIf="orders.length === 0 && !isLoading">
              <td colspan="6" class="text-center py-4 text-muted">No orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .text-navy { color: var(--qt-navy); }
    .bg-white { background-color: #fff; }
    .bg-light { background-color: #f8f9fa; }
    
    .shadow-sm { box-shadow: var(--box-shadow-sm); }
    .border-none { border: none; }
    .overflow-hidden { overflow: hidden; }
    
    .mb-0 { margin: 0; }
    .mb-4 { margin-bottom: 1.5rem; }
    .p-0 { padding: 0 !important; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .text-center { text-align: center; }
    
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); text-align: left; vertical-align: middle; }
    .table th { font-weight: 600; color: var(--qt-navy); }
    
    .fw-500 { font-weight: 500; }
    .small { font-size: 0.85rem; }
    
    .badge {
      padding: 0.35rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      background: var(--qt-navy);
    }
    .badge-success { background: var(--qt-success); }
    .badge-warning { background: var(--qt-warning); }
  `]
})
export class AdminOrdersComponent implements OnInit {
  adminService = inject(AdminService);
  toast = inject(ToastService);
  
  orders: any[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.adminService.getAllOrders().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.orders = res.data.content || res.data;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load orders.');
      }
    });
  }
}
