import { Routes } from '@angular/router';

export const ORDER_ROUTES: Routes = [
  {
    path: 'pricing',
    loadComponent: () => import('./pricing/pricing.component').then(c => c.PricingComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./history/order-history.component').then(c => c.OrderHistoryComponent)
  },
  {
    path: 'checkout/:type/:id',
    loadComponent: () => import('./checkout/checkout.component').then(c => c.CheckoutComponent)
  },
  {
    path: '',
    redirectTo: 'pricing',
    pathMatch: 'full'
  }
];
