import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NairaPipe } from '../../../shared/pipes/naira.pipe';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, NairaPipe],
  template: `
    <div class="bg-secondary min-vh-100 py-5">
      <app-spinner [show]="isLoading"></app-spinner>
      <div class="container text-center">
        <h2 class="mb-4">Pricing & Services</h2>
        <p class="text-muted mb-5">Transparent pricing for all our premium and standard services.</p>
        
        <div class="pricing-grid">
          <div class="card p-4 shadow-sm border-none" *ngFor="let item of pricingList">
            <h4 class="text-navy">{{ item.serviceType.replace('_', ' ') }}</h4>
            <h2 class="mt-3 mb-4 text-orange">{{ item.price | naira }}</h2>
            <ul class="text-start mb-4">
              <li *ngIf="item.serviceType === 'STANDARD_CV_DOWNLOAD' || item.serviceType === 'ACADEMIC_CV_DOWNLOAD'">Download perfectly formatted ATS-optimized PDF</li>
              <li *ngIf="item.serviceType === 'COVER_LETTER_DOWNLOAD'">Download AI-generated, tailored Cover Letter</li>
              <li *ngIf="item.serviceType === 'EXPERT_REVIEW'">Get our professionals to review and perfect your CV</li>
              <li *ngIf="item.serviceType === 'CV_BUNDLE'">Download both Standard and Academic CVs at a discount</li>
            </ul>
            <button class="btn btn-outline-primary mt-auto" (click)="placeOrder(item)">Order Now</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 { min-height: 100vh; }
    .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
    .bg-secondary { background-color: var(--qt-bg-secondary); }
    .text-center { text-align: center; }
    .text-start { text-align: left; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mb-5 { margin-bottom: 3rem; }
    .mt-3 { margin-top: 1rem; }
    .mt-auto { margin-top: auto; }
    
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .card { display: flex; flex-direction: column; }
    .shadow-sm { box-shadow: var(--box-shadow-sm); }
    .border-none { border: none; }
    .text-navy { color: var(--qt-navy); }
    .text-orange { color: var(--qt-orange); }
  `]
})
export class PricingComponent implements OnInit {
  orderService = inject(OrderService);
  toast = inject(ToastService);

  isLoading = true;
  pricingList: any[] = [];

  ngOnInit() {
    this.orderService.getPricingCatalogue().subscribe({
      next: (res) => {
        this.isLoading = false;
        // The endpoint returns an object like { "STANDARD_CV_DOWNLOAD": 2500, ... }
        // We transform it into an array for the view
        this.pricingList = Object.keys(res).map(key => ({
          serviceType: key,
          price: res[key]
        }));
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load pricing catalogue.');
      }
    });
  }

  placeOrder(item: any) {
    this.isLoading = true;
    this.orderService.createOrder({ serviceType: item.serviceType, referenceId: '' }).subscribe({
      next: () => {
        this.isLoading = false;
        // In our mock backend, order is immediately marked as PAID
        this.toast.success(`Purchased ${item.serviceType} successfully!`);
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to place order.');
      }
    });
  }
}
