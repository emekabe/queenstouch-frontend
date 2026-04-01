import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/admin-users.component').then(c => c.AdminUsersComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/admin-orders.component').then(c => c.AdminOrdersComponent)
      },
      {
        path: 'premium',
        loadComponent: () => import('./premium/admin-premium.component').then(c => c.AdminPremiumComponent)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pricing/admin-pricing.component').then(c => c.AdminPricingComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
