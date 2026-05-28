import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NairaPipe } from '../../../shared/pipes/naira.pipe';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, NavbarComponent, NairaPipe],
  template: `
    <app-navbar></app-navbar>
    <div class="bg-secondary min-vh-100 py-5">
      <app-spinner [show]="isLoading"></app-spinner>
      <div class="container text-center">
        <h2 class="mb-4">Pricing & Services</h2>
        <p class="text-muted mb-5">
          Transparent pricing for all our premium and standard services.
        </p>

        <div class="pricing-grid">
          @for (item of pricingList; track item) {
            <div class="card p-4 shadow-sm border-none">
              <h4 class="text-navy">{{ (item.label || item.serviceType).replace('_', ' ') }}</h4>
              <h2 class="mt-3 mb-4 text-orange">{{ item.minPrice || item.price | naira }}</h2>
              <ul class="text-start mb-4">
                @if (
                  item.serviceKey === 'STANDARD_CV' ||
                  item.serviceKey === 'ACADEMIC_CV'
                ) {
                  <li>Download perfectly formatted ATS-optimized PDF</li>
                }
                @if (item.serviceKey === 'COVER_LETTER') {
                  <li>Download AI-generated, tailored Cover Letter</li>
                }
              </ul>
              <button class="btn btn-outline-primary mt-auto" (click)="goToBuilder(item)">
                Get Started
              </button>
            </div>
          }
        </div>

        <p class="text-muted mt-5 small">
          To purchase a document download, first create your document in the
          <a routerLink="/cv">CV Builder</a> or
          <a routerLink="/cover-letter">Cover Letter Builder</a>,
          then click the download button from your document.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .min-vh-100 {
        min-height: 100vh;
      }
      .py-5 {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
      .bg-secondary {
        background-color: var(--qt-bg-secondary);
      }
      .text-center {
        text-align: center;
      }
      .text-start {
        text-align: left;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .mb-5 {
        margin-bottom: 3rem;
      }
      .mt-3 {
        margin-top: 1rem;
      }
      .mt-5 {
        margin-top: 3rem;
      }
      .mt-auto {
        margin-top: auto;
      }

      .pricing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        max-width: 1000px;
        margin: 0 auto;
      }

      .card {
        display: flex;
        flex-direction: column;
      }
      .shadow-sm {
        box-shadow: var(--box-shadow-sm);
      }
      .border-none {
        border: none;
      }
      .text-navy {
        color: var(--qt-navy);
      }
      .text-orange {
        color: var(--qt-orange);
      }
    `,
  ],
})
export class PricingComponent implements OnInit {
  orderService = inject(OrderService);
  toast = inject(ToastService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  isLoading = true;
  pricingList: any[] = [];

  ngOnInit() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.orderService.getPricingCatalogue().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        if (data && Array.isArray(data)) {
          this.pricingList = data;
        } else if (data) {
          this.pricingList = Object.keys(data).map((key) => ({
            serviceKey: (data[key] as any).serviceKey || key,
            label: (data[key] as any).label || key,
            minPrice: (data[key] as any).minPrice || data[key],
          }));
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load pricing catalogue.');
      },
    });
  }

  /**
   * The checkout flow requires a specific document ID.
   * Route the user to the appropriate builder so they can create
   * a document first, then download (and pay) from there.
   */
  goToBuilder(item: any) {
    const key: string = item.serviceKey || '';
    if (key === 'COVER_LETTER') {
      this.router.navigate(['/cover-letter']);
    } else {
      // STANDARD_CV, ACADEMIC_CV, or anything CV-related
      this.router.navigate(['/cv']);
    }
  }
}

