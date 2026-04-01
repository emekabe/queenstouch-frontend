import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(c => c.LandingComponent),
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cv',
    loadChildren: () => import('./features/cv/cv.routes').then(m => m.CV_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'cover-letters',
    loadChildren: () => import('./features/cover-letter/cover-letter.routes').then(m => m.COVER_LETTER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'linkedin',
    loadChildren: () => import('./features/linkedin/linkedin.routes').then(m => m.LINKEDIN_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.routes').then(m => m.ORDER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'premium',
    loadChildren: () => import('./features/premium/premium.routes').then(m => m.PREMIUM_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
