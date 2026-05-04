import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestStatus } from '../../../core/models/premium-request.model';

@Component({
  selector: 'app-admin-premium',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  template: `
    <div class="container-fluid py-2">
      <app-spinner [show]="isLoading"></app-spinner>

      <div class="mb-4 d-flex justify-content-between align-items-center">
        <h3 class="mb-0 text-navy">Premium Requests Management</h3>
      </div>

      <div class="card p-0 shadow-sm border-none overflow-hidden bg-white mb-4">
        <table class="table mb-0">
          <thead class="bg-light">
            <tr>
              <th>Request ID</th>
              <th>User Email</th>
              <th>Order Ref</th>
              <th>Status</th>
              <th>Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (req of requests; track req) {
              <tr>
                <td>
                  <span class="small text-muted">{{ req.id }}</span>
                </td>
                <td class="fw-500">{{ req.userEmail }}</td>
                <td>
                  <span class="small text-muted">{{ req.orderId }}</span>
                </td>
                <td>
                  <span
                    class="badge"
                    [ngClass]="{
                      'badge-info': req.status === 'PENDING',
                      'badge-warning': req.status === 'IN_PROGRESS',
                      'badge-success': req.status === 'COMPLETED',
                    }"
                  >
                    {{ req.status }}
                  </span>
                </td>
                <td>{{ req.createdAt | date: 'medium' }}</td>
                <td class="text-right d-flex gap-2 justify-content-end">
                  @if (req.status === 'PENDING') {
                    <button
                      class="btn btn-sm btn-outline-primary"
                      (click)="updateStatus(req, 'IN_PROGRESS')"
                    >
                      Mark In Progress
                    </button>
                  }
                  @if (req.status === 'IN_PROGRESS') {
                    <button
                      class="btn btn-sm btn-success text-white"
                      (click)="openDeliverModal(req)"
                    >
                      Deliver CV
                    </button>
                  }
                </td>
              </tr>
            }
            @if (requests.length === 0 && !isLoading) {
              <tr>
                <td colspan="6" class="text-center py-4 text-muted">No premium requests found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Deliver CV Modal (Mocked inline for this prototype) -->
      @if (selectedRequest) {
        <div class="card p-4 shadow-sm border-none bg-white">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="m-0 text-navy">
              Deliver Final CV to User ({{ selectedRequest.userEmail }})
            </h5>
            <button class="btn btn-sm btn-light border" (click)="selectedRequest = null">
              Cancel
            </button>
          </div>
          <form [formGroup]="deliverForm" (ngSubmit)="submitDelivery()">
            <div class="form-group mb-3">
              <label class="form-label">Upload Finalized CV Document</label>
              <input type="file" class="form-control" (change)="onFileSelected($event)" />
            </div>
            <div class="form-group mb-4">
              <label class="form-label">Feedback Notes</label>
              <textarea
                class="form-control"
                formControlName="feedback"
                rows="3"
                placeholder="Notes for the user..."
              ></textarea>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="deliverForm.invalid || !deliveryFile || isLoading"
            >
              Complete Request & Deliver
            </button>
          </form>
        </div>
      }
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
      .justify-content-end {
        justify-content: flex-end;
      }
      .align-items-center {
        align-items: center;
      }
      .gap-2 {
        gap: 0.5rem;
      }

      .m-0 {
        margin: 0;
      }
      .mb-0 {
        margin: 0;
      }
      .mb-3 {
        margin-bottom: 1rem;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .p-0 {
        padding: 0 !important;
      }
      .p-4 {
        padding: 1.5rem;
      }
      .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
      .py-4 {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
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
      .badge-info {
        background: #17a2b8;
      }
      .badge-warning {
        background: var(--qt-warning);
      }
      .badge-success {
        background: var(--qt-success);
      }

      .btn-light {
        background: #f8f9fa;
        border-color: #e9ecef;
      }
    `,
  ],
})
export class AdminPremiumComponent implements OnInit {
  private fb = inject(FormBuilder);
  adminService = inject(AdminService);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  requests: any[] = [];
  isLoading = false;

  selectedRequest: any = null;
  deliveryFile: File | null = null;

  deliverForm = this.fb.group({
    feedback: ['', Validators.required],
  });

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.adminService.getPremiumRequests().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.requests = res.data.content || res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load premium requests.');
      },
    });
  }

  updateStatus(req: any, status: any) {
    const requestStatus = status as RequestStatus;
    this.isLoading = true;
    this.cdr.detectChanges();
    this.adminService.updatePremiumRequestStatus(req.id, { status: requestStatus }).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.success(`Request marked as ${status.replace('_', ' ')}.`);
        this.loadRequests();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to update status.');
      },
    });
  }

  openDeliverModal(req: any) {
    this.selectedRequest = req;
    this.deliverForm.reset();
    this.deliveryFile = null;
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.deliveryFile = event.target.files[0];
    }
  }

  submitDelivery() {
    if (!this.selectedRequest || !this.deliveryFile || this.deliverForm.invalid) return;
    this.isLoading = true;

    const feedback = this.deliverForm.value.feedback;

    this.adminService
      .deliverPremiumCV(this.selectedRequest.id, this.deliveryFile, feedback || '')
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toast.success('CV Delivered successfully (Status updated to COMPLETED)!');
          this.selectedRequest = null;
          this.loadRequests();
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Failed to deliver CV.');
        },
      });
  }
}
