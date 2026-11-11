import { RenderMode, ServerRoute } from '@angular/ssr';
import { caseStudies } from './core/portfolio.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'case-studies/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      return caseStudies.map((s) => ({ slug: s.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
