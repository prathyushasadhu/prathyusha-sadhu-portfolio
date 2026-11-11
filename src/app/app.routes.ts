import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'case-studies/:slug',
    loadComponent: () => import('./pages/case-study/case-study.component').then((m) => m.CaseStudyComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
