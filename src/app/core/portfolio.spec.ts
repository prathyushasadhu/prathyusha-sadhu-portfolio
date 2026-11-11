import { describe, it, expect } from 'vitest';
import {
  profile,
  studios,
  verifiedStats,
  caseStudies,
  products,
  projectCards,
} from './portfolio.data';

describe('Portfolio Data Invariant Checks', () => {
  it('should strictly contain exactly 3 studios without Creative Studio', () => {
    expect(studios.length).toBe(3);
    const studioIds = studios.map((s) => s.id);
    expect(studioIds).toEqual(['engineering', 'ai', 'product']);
    expect(studioIds).not.toContain('creative');
  });

  it('should have verified stats matching prompt requirements', () => {
    expect(verifiedStats.length).toBe(5);
    const lighthouseStat = verifiedStats.find((s) => s.value === '90+');
    expect(lighthouseStat).toBeDefined();
    expect(lighthouseStat?.label).toBe('Lighthouse 90+ on enterprise apps');
  });

  it('should keep q-live in AI Lab only, and Jarvis + Stock Analyzer in Product Studio', () => {
    const productNames = products.map((p) => p.name);
    expect(productNames).toEqual(['Jarvis', 'Stock Analyzer']);
    expect(productNames).not.toContain('q-live');

    const qLiveCaseStudy = caseStudies.find((c) => c.slug === 'q-live');
    expect(qLiveCaseStudy).toBeDefined();
    expect(qLiveCaseStudy?.lab).toBe('ai');
    expect(qLiveCaseStudy?.kind).toBe('Personal');
  });

  it('should never contain a phone number or availability badge', () => {
    const serialized = JSON.stringify({ profile, caseStudies, products });
    expect(serialized).not.toMatch(/\+?\d{2,3}[- ]?\d{10}/);
    expect(serialized.toLowerCase()).not.toContain('open to work');
    expect(serialized.toLowerCase()).not.toContain('immediately available');
  });

  it('should correctly configure project cards for the 3 rings', () => {
    const engCount = projectCards.filter((p) => p.labId === 'engineering').length;
    const aiCount = projectCards.filter((p) => p.labId === 'ai').length;
    const prodCount = projectCards.filter((p) => p.labId === 'product').length;

    expect(engCount).toBe(5);
    expect(aiCount).toBe(3);
    expect(prodCount).toBe(2);
  });

  it('should have exact orbitLabel for all 10 planets matching prompt specification', () => {
    const labels = projectCards.map((p) => ({ id: p.id, label: p.orbitLabel }));
    expect(labels).toEqual([
      { id: 'pj-eng-arch', label: 'Angular Architecture' },
      { id: 'pj-eng-cwv', label: 'Web Performance' },
      { id: 'pj-eng-pay', label: 'Payments' },
      { id: 'pj-eng-aem', label: 'AEM Images' },
      { id: 'pj-journey-edu', label: 'Education' },
      { id: 'pj-ai-qlive', label: 'q-live' },
      { id: 'pj-ai-chat', label: 'AI Chat' },
      { id: 'pj-ai-perf', label: 'Perf Engine' },
      { id: 'pj-prod-jarvis', label: 'Jarvis' },
      { id: 'pj-prod-stock', label: 'Stock Analyzer' },
    ]);
  });
});

