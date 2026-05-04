import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <div class="container-fluid py-2">
      <app-spinner [show]="isLoading"></app-spinner>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0 text-navy">User Management</h3>
        <button class="btn btn-primary btn-sm">+ Admin</button>
      </div>

      <div class="card p-0 shadow-sm border-none overflow-hidden bg-white">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users; track user) {
              <tr>
                <td>
                  <span class="small text-muted">{{ user.id }}</span>
                </td>
                <td class="fw-500">{{ user.firstName }} {{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" [ngClass]="user.role === 'ADMIN' ? 'bg-orange' : 'bg-navy'">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="user.enabled ? 'badge-success' : 'badge-danger'">
                    {{ user.enabled ? 'Active' : 'Disabled' }}
                  </span>
                </td>
                <td class="text-right">
                  <button class="btn btn-sm btn-outline-secondary me-2">Edit</button>
                </td>
              </tr>
            }
            @if (users.length === 0 && !isLoading) {
              <tr>
                <td colspan="6" class="text-center py-4 text-muted">No users found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .text-navy {
        color: var(--qt-navy);
      }
      .bg-white {
        background-color: #fff;
      }
      .bg-light {
        background-color: #f8f9fa;
      }
      .bg-navy {
        background-color: var(--qt-navy);
      }
      .bg-orange {
        background-color: var(--qt-orange);
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

      .d-flex {
        display: flex;
      }
      .justify-content-between {
        justify-content: space-between;
      }
      .align-items-center {
        align-items: center;
      }

      .mb-0 {
        margin: 0;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .p-0 {
        padding: 0 !important;
      }
      .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
      .py-4 {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
      }
      .me-2 {
        margin-right: 0.5rem;
      }
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center;
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
        vertical-align: middle;
      }
      .table th {
        font-weight: 600;
        color: var(--qt-navy);
      }

      .fw-500 {
        font-weight: 500;
      }
      .small {
        font-size: 0.85rem;
      }

      .badge {
        padding: 0.35rem 0.6rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
      }
      .badge-success {
        background: var(--qt-success);
      }
      .badge-danger {
        background: var(--qt-danger);
      }

      .btn-outline-secondary {
        color: var(--qt-navy);
        border: 1px solid var(--border-color);
        background: transparent;
      }
      .btn-outline-secondary:hover {
        background: #f8f9fa;
      }
      .btn-outline-danger {
        border: 1px solid var(--qt-danger);
        color: var(--qt-danger);
        background: transparent;
      }
      .btn-outline-danger:hover {
        background: rgba(220, 53, 69, 0.1);
      }
      .btn-outline-success {
        border: 1px solid var(--qt-success);
        color: var(--qt-success);
        background: transparent;
      }
      .btn-outline-success:hover {
        background: rgba(40, 167, 69, 0.1);
      }
    `,
  ],
})
export class AdminUsersComponent implements OnInit {
  adminService = inject(AdminService);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  users: any[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.adminService.getUsers().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.users = res.data.content || res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load users.');
      },
    });
  }
}
