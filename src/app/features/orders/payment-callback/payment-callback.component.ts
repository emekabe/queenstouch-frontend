import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container py-5 min-vh-100 d-flex justify-content-center align-items-center">
      <div class="callback-card text-center shadow-sm p-5 bg-white rounded-lg">
        @if (status === 'verifying') {
          <app-spinner [show]="true"></app-spinner>
          <h4 class="mt-4 text-navy">Verifying Payment...</h4>
          <p class="text-muted small">Please wait while we confirm your transaction securely.</p>
        } @else if (status === 'success') {
          <div class="mb-4">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-success mb-2">Payment Successful!</h4>
          <p class="text-muted small mb-4">Your document is now unlocked and ready for download.</p>
          <button (click)="goToDashboard()" class="btn btn-primary px-4 py-2">
            Go to Dashboard
          </button>
        } @else {
          <div class="mb-4">
            <i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-danger mb-2">Payment Failed</h4>
          <p class="text-muted small mb-4">We could not verify your payment. Please try again or contact support.</p>
          <button (click)="goToDashboard()" class="btn btn-outline-secondary px-4 py-2">
            Return to Dashboard
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .callback-card {
        max-width: 450px;
        width: 100%;
        border: 1px solid rgba(0,0,0,0.05);
      }
      .text-navy {
        color: var(--qt-navy);
      }
      .rounded-lg {
        border-radius: 12px;
      }
    `
  ]
})
export class PaymentCallbackComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  orderService = inject(OrderService);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  status: 'verifying' | 'success' | 'failed' = 'verifying';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const reference = params['reference'];
      if (reference) {
        this.verifyPayment(reference);
      } else {
        this.status = 'failed';
        this.toast.error('Invalid payment callback (no reference).');
        this.cdr.detectChanges();
      }
    });
  }

  verifyPayment(reference: string) {
    this.orderService.verifyPayment(reference).subscribe({
      next: () => {
        this.status = 'success';
        this.toast.success('Payment verified successfully!');
        this.cdr.detectChanges();
        // Redirect automatically after a short delay
        setTimeout(() => this.goToDashboard(), 3000);
      },
      error: () => {
        this.status = 'failed';
        this.toast.error('Payment verification failed.');
        this.cdr.detectChanges();
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
