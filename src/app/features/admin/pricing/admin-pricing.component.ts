import { Component, inject, OnInit } from '@angular/core';

import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NairaPipe } from '../../../shared/pipes/naira.pipe';

@Component({
  selector: 'app-admin-pricing',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent],
  template: `
    <div class="container-fluid py-2">
      <app-spinner [show]="isLoading"></app-spinner>

      <div class="mb-4">
        <h3 class="mb-0 text-navy">Service Pricing Catalogue</h3>
        <p class="text-muted small">Update base prices for all Queenstouch services.</p>
      </div>

      <div class="card p-4 shadow-sm border-none bg-white w-100" style="max-width: 800px;">
        <form [formGroup]="pricingForm" (ngSubmit)="savePricing()">
          <table class="table mb-4">
            <thead class="bg-light">
              <tr>
                <th>Service Name</th>
                <th>Service Enum Key</th>
                <th>Current Price (₦)</th>
              </tr>
            </thead>
            <tbody>
              <!-- Standard CV -->
              <tr>
                <td class="fw-500">Standard CV Download</td>
                <td><span class="small text-muted font-monospace">STANDARD_CV_DOWNLOAD</span></td>
                <td>
                  <input
                    type="number"
                    class="form-control"
                    formControlName="STANDARD_CV_DOWNLOAD"
                  />
                </td>
              </tr>
              <!-- Academic CV -->
              <tr>
                <td class="fw-500">Academic CV Download</td>
                <td><span class="small text-muted font-monospace">ACADEMIC_CV_DOWNLOAD</span></td>
                <td>
                  <input
                    type="number"
                    class="form-control"
                    formControlName="ACADEMIC_CV_DOWNLOAD"
                  />
                </td>
              </tr>
              <!-- Bundle -->
              <tr>
                <td class="fw-500">Standard + Academic Bundle</td>
                <td><span class="small text-muted font-monospace">CV_BUNDLE</span></td>
                <td>
                  <input type="number" class="form-control" formControlName="CV_BUNDLE" />
                </td>
              </tr>
              <!-- Cover Letter -->
              <tr>
                <td class="fw-500">Cover Letter Generation</td>
                <td><span class="small text-muted font-monospace">COVER_LETTER_DOWNLOAD</span></td>
                <td>
                  <input
                    type="number"
                    class="form-control"
                    formControlName="COVER_LETTER_DOWNLOAD"
                  />
                </td>
              </tr>
              <!-- Expert Review -->
              <tr>
                <td class="fw-500">Expert Review</td>
                <td><span class="small text-muted font-monospace">EXPERT_REVIEW</span></td>
                <td>
                  <input type="number" class="form-control" formControlName="EXPERT_REVIEW" />
                </td>
              </tr>
              <!-- Complete Overhaul -->
              <tr>
                <td class="fw-500">Complete Overhaul</td>
                <td><span class="small text-muted font-monospace">COMPLETE_OVERHAUL</span></td>
                <td>
                  <input type="number" class="form-control" formControlName="COMPLETE_OVERHAUL" />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="d-flex justify-content-end">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="pricingForm.invalid || isLoading"
            >
              💾 Save Pricing Rules
            </button>
          </div>
        </form>
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

      .shadow-sm {
        box-shadow: var(--box-shadow-sm);
      }
      .border-none {
        border: none;
      }
      .w-100 {
        width: 100%;
      }

      .d-flex {
        display: flex;
      }
      .justify-content-end {
        justify-content: flex-end;
      }

      .mb-0 {
        margin: 0;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .p-4 {
        padding: 1.5rem;
      }
      .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
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
      .font-monospace {
        font-family: monospace;
        background: #f0f0f0;
        padding: 2px 4px;
        border-radius: 4px;
      }
    `,
  ],
})
export class AdminPricingComponent implements OnInit {
  private fb = inject(FormBuilder);
  adminService = inject(AdminService);
  toast = inject(ToastService);

  isLoading = false;

  pricingForm = this.fb.group({
    STANDARD_CV_DOWNLOAD: [2500, Validators.required],
    ACADEMIC_CV_DOWNLOAD: [3500, Validators.required],
    CV_BUNDLE: [5000, Validators.required],
    COVER_LETTER_DOWNLOAD: [1500, Validators.required],
    EXPERT_REVIEW: [15000, Validators.required],
    COMPLETE_OVERHAUL: [25000, Validators.required],
  });

  ngOnInit() {
    this.isLoading = true;
    this.adminService.getAllPricing().subscribe({
      next: (res: any) => {
        const prices = res.data;
        const patchData: any = {};
        if (Array.isArray(prices)) {
          prices.forEach((p) => (patchData[p.serviceKey] = p.minPrice));
        }
        this.pricingForm.patchValue(patchData);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load pricing');
      },
    });
  }

  savePricing() {
    if (this.pricingForm.invalid) return;
    this.isLoading = true;

    // Build array of Catalogue requests
    const updates = Object.keys(this.pricingForm.value).map((key) => {
      const amount = (this.pricingForm.value as any)[key];
      // Only fire request if amount is valid
      if (amount !== null && amount !== undefined) {
        return this.adminService
          .updatePricing(key, { minPrice: amount, maxPrice: amount })
          .toPromise();
      }
      return Promise.resolve();
    });

    Promise.all(updates)
      .then(() => {
        this.isLoading = false;
        this.toast.success('Pricing catalogue updated successfully.');
      })
      .catch(() => {
        this.isLoading = false;
        this.toast.error('Some updates may have failed.');
      });
  }
}
