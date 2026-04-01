import { Routes } from '@angular/router';

export const COVER_LETTER_ROUTES: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./cover-letter-list/cover-letter-list.component').then(c => c.CoverLetterListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./cover-letter-builder/cover-letter-builder.component').then(c => c.CoverLetterBuilderComponent)
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];
