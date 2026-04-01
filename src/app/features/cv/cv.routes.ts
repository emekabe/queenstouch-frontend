import { Routes } from '@angular/router';

export const CV_ROUTES: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./cv-list/cv-list.component').then(c => c.CvListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./cv-builder/cv-builder.component').then(c => c.CvBuilderComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./cv-builder/cv-builder.component').then(c => c.CvBuilderComponent)
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];
