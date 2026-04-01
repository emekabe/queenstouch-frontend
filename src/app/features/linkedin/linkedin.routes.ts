import { Routes } from '@angular/router';

export const LINKEDIN_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./linkedin-generator/linkedin-generator.component').then(c => c.LinkedInGeneratorComponent)
  },
  {
    path: '',
    redirectTo: 'new',
    pathMatch: 'full'
  }
];
