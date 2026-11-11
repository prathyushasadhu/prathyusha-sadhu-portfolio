import { describe, it, expect } from 'vitest';
import { demoReply, demoFallback } from './assistant';

describe('Assistant Demo Logic', () => {
  it('should return Angular experience when query contains "angular"', () => {
    const res = demoReply('Can you tell me about her angular background?');
    expect(res).toContain('9+ years of Angular experience');
    expect(res).toContain('Infosys');
    expect(res).toContain('Mindtree');
  });

  it('should return performance metrics when query contains "performance" or "lighthouse"', () => {
    const res = demoReply('What are her lighthouse performance achievements?');
    expect(res).toContain('Lighthouse performance scores of 90+');
    expect(res).toContain('under 2.2s');
    expect(res).toContain('bundle size by 30%');
  });

  it('should return AI projects when query contains "ai"', () => {
    const res = demoReply('What AI projects has she built?');
    expect(res).toContain('q-live');
    expect(res).toContain('Jarvis');
    expect(res).toContain('multi-model AI chat platform');
    expect(res).toContain('personal projects');
  });

  it('should return contact information when query contains "contact" or "email"', () => {
    const res = demoReply('How do I contact Prathyusha?');
    expect(res).toContain('prathyushasadhu12@gmail.com');
    expect(res).toContain('linkedin.com/in/prathyusha-sadhu-39144b79');
  });

  it('should return safe fallback when query does not match portfolio facts', () => {
    const res = demoReply('What is her favorite movie or video game?');
    expect(res).toBe(demoFallback);
  });
});

