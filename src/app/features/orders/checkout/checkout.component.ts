import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NairaPipe } from '../../../shared/pipes/naira.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent, NavbarComponent, NairaPipe],
  template: `
    <app-navbar></app-navbar>
    <div class="container py-5 min-vh-100">
      <app-spinner [show]="isLoading"></app-spinner>
      
      <div class="checkout-card mx-auto shadow-lg bg-white rounded-lg overflow-hidden">
        <div class="p-4 bg-navy text-white text-center">
          <h3 class="m-0">Complete Purchase</h3>
          <p class="small m-0 text-light opacity-75">Securely unlock your professional document</p>
        </div>
        
        <div class="p-5">
          <div class="mb-4 text-center">
            <div class="service-icon mb-3">
              <i class="bi bi-file-earmark-pdf fs-1 text-navy"></i>
            </div>
            <h4 class="text-navy mb-1">{{ itemLabel }}</h4>
            <div class="text-muted small">Standard Platform Fee</div>
          </div>

          <div class="order-summary mb-5 p-3 rounded bg-light">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Item Type:</span>
              <span class="fw-bold">{{ documentType === 'CV' ? 'Resume / CV' : 'Cover Letter' }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Document ID:</span>
              <span class="small font-monospace">{{ documentId }}</span>
            </div>
            <hr class="my-3 opacity-10">
            <div class="d-flex justify-content-between align-items-center">
              <span class="h5 m-0 fw-bold">Total Amount:</span>
              <span class="h4 m-0 text-navy fw-bold">{{ price | naira }}</span>
            </div>
          </div>

          <div class="d-grid gap-3">
            <button (click)="processPayment()" class="btn btn-primary btn-lg py-3 shadow-sm border-0 d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-shield-check"></i>
              {{ isLoading ? 'Processing...' : 'Pay & Download Now' }}
            </button>
            <button routerLink="/dashboard" class="btn btn-link text-muted text-decoration-none small">
              Cancel and return to dashboard
            </button>
          </div>
        </div>

        <div class="px-5 py-3 bg-light border-top text-center">
          <div class="d-flex justify-content-center gap-4 text-muted opacity-50 small">
            <div class="d-flex align-items-center gap-1"><i class="bi bi-lock-fill"></i> Secure</div>
            <div class="d-flex align-items-center gap-1"><i class="bi bi-lightning-fill"></i> Instant</div>
            <div class="d-flex align-items-center gap-1"><i class="bi bi-patch-check-fill"></i> Official</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
    .checkout-card { max-width: 480px; border: 1px solid rgba(0,0,0,0.05); }
    .bg-navy { background-color: var(--qt-navy); }
    .text-navy { color: var(--qt-navy); }
    .bg-light { background-color: #f8f9fc; }
    .rounded-lg { border-radius: 12px; }
    .opacity-75 { opacity: 0.75; }
    .opacity-10 { opacity: 0.1; }
    .fw-bold { font-weight: 700; }
    
    .service-icon {
      width: 64px;
      height: 64px;
      background: var(--qt-bg-secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  orderService = inject(OrderService);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  documentType: 'CV' | 'COVER_LETTER' = 'CV';
  documentId: string = '';
  serviceKey: string = '';
  itemLabel: string = 'Document Download';
  price: number = 0;
  isLoading = false;

  ngOnInit() {
    this.documentType = this.route.snapshot.params['type']?.toUpperCase() as 'CV' | 'COVER_LETTER';
    this.documentId = this.route.snapshot.params['id'];
    this.serviceKey = this.documentType === 'CV' ? 'STANDARD_CV' : 'COVER_LETTER';
    
    this.fetchPricing();
  }

  fetchPricing() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.orderService.getPricingCatalogue().subscribe({
      next: (res) => {
        const pricingArr = res.data;
        const pricingInfo = pricingArr.find(p => p.serviceKey === this.serviceKey);
        if (pricingInfo) {
          this.price = pricingInfo.minPrice;
          this.itemLabel = pricingInfo.label || this.itemLabel;
        } else {
          // Fallback if key doesn't match exactly
          this.price = this.documentType === 'CV' ? 5000 : 2000;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.price = this.documentType === 'CV' ? 5000 : 2000;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  processPayment() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.orderService.createOrder({
      serviceKeys: [this.serviceKey],
      relatedDocumentId: this.documentId,
      relatedDocumentType: this.documentType
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.success('Purchase successful! Downloading document...');
        
        // Redirect back to CV list or CL list and trigger download will be handled there
        this.router.navigate([this.documentType === 'CV' ? '/cv' : '/cover-letters']);
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to complete purchase. Please try again.');
      }
    });
  }
}
