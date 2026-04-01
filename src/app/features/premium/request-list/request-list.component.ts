import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PremiumRequestService } from '../../../core/services/premium-request.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  template: `
    <div class="container py-5 min-vh-100">
      <app-spinner [show]="isLoading"></app-spinner>
      
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>My Premium Requests</h2>
        <a routerLink="/premium/new" class="btn btn-primary">+ New Request</a>
      </div>

      <div class="card p-0 shadow-sm border-none overflow-hidden">
        <table class="table mb-0">
          <thead class="bg-secondary">
            <tr>
              <th>Request ID</th>
              <th>Status</th>
              <th>Date Submitted</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let req of requests">
              <td><span class="small text-muted">{{ req.id }}</span></td>
              <td>
                <span class="badge" 
                  [ngClass]="{
                    'badge-info': req.status === 'PENDING',
                    'badge-warning': req.status === 'IN_PROGRESS',
                    'badge-success': req.status === 'COMPLETED'
                  }">
                  {{ req.status }}
                </span>
              </td>
              <td>{{ req.createdAt | date:'medium' }}</td>
              <td class="text-right">
                <button class="btn btn-sm btn-outline-secondary me-2">View</button>
              </td>
            </tr>
            <tr *ngIf="requests.length === 0 && !isLoading">
              <td colspan="4" class="text-center py-4 text-muted">You have no active premium requests.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 0 auto; }
    .min-vh-100 { min-height: 100vh; }
    .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .p-0 { padding: 0 !important; }
    .mb-0 { margin-bottom: 0 !important; }
    .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .shadow-sm { box-shadow: var(--box-shadow-sm); }
    .border-none { border: none; }
    .overflow-hidden { overflow: hidden; }
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); text-align: left; }
    .table th { font-weight: 600; color: var(--qt-navy); }
    .bg-secondary { background-color: var(--qt-bg-secondary); }
    .small { font-size: 0.875rem; }
    .text-right { text-align: right; }
    
    .badge {
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      background: var(--qt-navy);
    }
    .badge-info { background: #17a2b8; }
    .badge-warning { background: var(--qt-warning); }
    .badge-success { background: var(--qt-success); }
    
    .btn-outline-secondary { color: var(--qt-navy); border: 1px solid var(--border-color); background: transparent; }
    .btn-outline-secondary:hover { background: var(--qt-bg-secondary); }
  `]
})
export class RequestListComponent implements OnInit {
  reqService = inject(PremiumRequestService);
  toast = inject(ToastService);
  
  requests: any[] = [];
  isLoading = false;

  ngOnInit() {
    this.isLoading = true;
    this.reqService.listForUser().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.requests = res.data.content || res.data; 
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load premium requests.');
      }
    });
  }
}
