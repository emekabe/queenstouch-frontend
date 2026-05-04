import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { AdminStats, RecentActivity } from '../../../core/models/admin-response.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <div class="container-fluid py-2">
      <app-spinner [show]="isLoading"></app-spinner>
      <h3 class="mb-4 text-navy">Overview</h3>

      <!-- Stats Row -->
      <div class="stats-grid mb-5">
        <div class="card p-4 shadow-sm border-none bg-white rounded">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="text-muted m-0">Total Users</h6>
            <span class="icon text-primary rounded-circle p-2 bg-secondary">👥</span>
          </div>
          <h2 class="m-0">{{ stats?.totalUsers || 0 }}</h2>
        </div>

        <div class="card p-4 shadow-sm border-none bg-white rounded">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="text-muted m-0">Active Orders</h6>
            <span class="icon text-primary rounded-circle p-2 bg-secondary">🛍️</span>
          </div>
          <h2 class="m-0">{{ stats?.totalOrders || 0 }}</h2>
        </div>

        <div class="card p-4 shadow-sm border-none bg-white rounded">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="text-muted m-0">Premium Requests</h6>
            <span class="icon text-primary rounded-circle p-2 bg-secondary">⭐</span>
          </div>
          <h2 class="m-0">{{ stats?.totalPremiumRequests || 0 }}</h2>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card p-4 shadow-sm border-none bg-white rounded">
        <h5 class="mb-4">Recent Activity</h5>

        <div class="activity-list border border-secondary rounded p-3">
          @for (act of recentActivities; track act; let last = $last) {
            <div
              class="d-flex justify-content-between align-items-center py-2"
              [class.border-bottom]="!last"
            >
              <div>
                <span class="fw-500">{{ act.title }}</span>
                <p class="small text-muted m-0">{{ act.desc }}</p>
              </div>
              <span class="small text-muted">{{ act.time | date: 'short' }}</span>
            </div>
          }
          @if (recentActivities.length === 0 && !isLoading) {
            <div class="text-center text-muted py-3">No recent activity.</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .text-navy {
        color: var(--qt-navy);
      }
      .text-success {
        color: var(--qt-success);
      }
      .text-warning {
        color: var(--qt-warning);
      }
      .bg-white {
        background-color: #fff;
      }
      .bg-secondary {
        background-color: var(--qt-bg-secondary);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
      }

      .shadow-sm {
        box-shadow: var(--box-shadow-sm);
      }
      .border-none {
        border: none;
      }
      .border {
        border: 1px solid var(--border-color);
      }
      .border-bottom {
        border-bottom: 1px solid var(--border-color);
      }
      .rounded {
        border-radius: 8px;
      }

      .d-flex {
        display: flex;
      }
      .justify-content-between {
        justify-content: space-between;
      }
      .align-items-center {
        align-items: center;
      }

      .m-0 {
        margin: 0;
      }
      .mb-2 {
        margin-bottom: 0.5rem;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .mb-5 {
        margin-bottom: 3rem;
      }
      .mt-2 {
        margin-top: 0.5rem;
      }

      .p-2 {
        padding: 0.5rem;
      }
      .p-3 {
        padding: 1rem;
      }
      .p-4 {
        padding: 1.5rem;
      }
      .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }

      .fw-500 {
        font-weight: 500;
      }
      .small {
        font-size: 0.875rem;
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  adminService = inject(AdminService);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  isLoading = true;
  stats: AdminStats | null = null;
  recentActivities: RecentActivity[] = [];

  ngOnInit() {
    this.isLoading = true;
    this.adminService.getStats().subscribe({
      next: (res) => {
        this.stats = res.data;
        this.cdr.detectChanges();
      },
      error: () => this.toast.error('Failed to load stats'),
    });

    this.adminService.getRecentActivity().subscribe({
      next: (res) => {
        this.recentActivities = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
