import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PremiumRequestService } from '../../../core/services/premium-request.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SpinnerComponent, FileUploadComponent],
  template: `
    <div class="bg-secondary min-vh-100 py-5">
      <app-spinner [show]="isLoading"></app-spinner>
      <div class="container" style="max-width: 800px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Request Premium Service</h2>
          <a routerLink="/premium/requests" class="btn btn-outline-secondary btn-sm">My Requests</a>
        </div>

        <div class="card p-4 border-none shadow-sm mb-4">
          <form [formGroup]="requestForm" (ngSubmit)="submitRequest()">
            
            <div class="form-group mb-4">
              <label class="form-label">Service Type</label>
              <select class="form-select w-100 p-2 border rounded" formControlName="orderId">
                <option value="" disabled selected>Select an active order...</option>
                <option value="EXPERT_REVIEW">Expert CV Review (Standard Order)</option>
                <option value="COMPLETE_OVERHAUL">Complete Overhaul (Premium Order)</option>
              </select>
              <small class="text-muted d-block mt-1">Normally this would list actual purchased Order IDs to link to.</small>
            </div>

            <div class="form-group mb-4">
              <label class="form-label">Upload Current CV</label>
              <app-file-upload (fileChanged)="onFileSelected($event)"></app-file-upload>
            </div>
            
            <div class="form-group mt-3">
              <label class="form-label">Additional Instructions / Notes</label>
              <textarea class="form-control" formControlName="notes" rows="5" placeholder="Let our experts know exactly what you are aiming for..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary mt-4 w-100" [disabled]="requestForm.invalid || !selectedFile || isLoading">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 { min-height: 100vh; }
    .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
    .bg-secondary { background-color: var(--qt-bg-secondary); }
    .shadow-sm { box-shadow: var(--box-shadow-sm); }
    .border-none { border: none; }
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .mt-1 { margin-top: 0.25rem; }
    .p-2 { padding: 0.5rem; }
    .w-100 { width: 100%; }
    .border { border: 1px solid var(--border-color); }
    .rounded { border-radius: 4px; }
    .d-block { display: block; }
  `]
})
export class RequestFormComponent {
  private fb = inject(FormBuilder);
  private premiumReqService = inject(PremiumRequestService);
  private toast = inject(ToastService);
  private router = inject(Router);

  isLoading = false;
  selectedFile: File | null = null;

  requestForm = this.fb.group({
    orderId: ['', Validators.required],
    notes: ['']
  });

  onFileSelected(file: File | null) {
    this.selectedFile = file;
  }

  submitRequest() {
    if (this.requestForm.invalid || !this.selectedFile) return;
    this.isLoading = true;
    
    // In a real scenario, we'd use FormData since there's a file upload
    // For this prototype, we're mimicking the structure and calling the service.
    // The backend signature accepts PremiumRequestDTO without multipart right now,
    // so we'll just mock it.
    
    const dto = {
      orderId: this.requestForm.value.orderId,
      notes: this.requestForm.value.notes
    };
    
    this.premiumReqService.submitRequest(dto, this.selectedFile).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Premium request submitted successfully! An expert will review it soon.');
        this.router.navigate(['/premium/requests']);
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to submit premium request.');
      }
    });
  }
}
