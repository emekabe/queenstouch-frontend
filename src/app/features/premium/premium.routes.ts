import { Routes } from '@angular/router';

export const PREMIUM_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./request-form/request-form.component').then(c => c.RequestFormComponent)
  },
  {
    path: 'requests',
    loadComponent: () => import('./request-list/request-list.component').then(c => c.RequestListComponent)
  },
  {
    path: '',
    redirectTo: 'requests',
    pathMatch: 'full'
  }
];
