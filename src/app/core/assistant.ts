// Demo mode (no API key): keyword-matched answers drawn from content.ts.
// Always show a visible "Demo mode" label in the UI.

export interface QA {
  keys: string[];
  answer: string;
}

export const demoAnswers: QA[] = [
  {
    keys: ['angular'],
    answer: 'Prathyusha has 9+ years of Angular experience (v8–19) with TypeScript, RxJS and NgRx. At Infosys she built enterprise Angular applications for a US telecom client, including 30+ reusable components and NgRx state management. At Mindtree she led frontend modernization with modular Angular components and shared component libraries.',
  },
  {
    keys: ['architecture', 'enterprise'],
    answer: 'She has worked on enterprise platforms at Infosys (a US telecom client) and Mindtree, including frontend modernization and component libraries adopted across business modules. She also designed the multi-tenant voice AI architecture for her personal project q-live. Her resume does not give formal architecture titles or diagrams for client work, so ask her directly for depth.',
  },
  {
    keys: ['performance', 'lighthouse', 'lcp', 'speed'],
    answer: 'At Infosys she reached Lighthouse performance scores of 90+, improved LCP from about 4s to under 2.2s and cut bundle size by 30% using lazy loading, code-splitting and module optimization. At Mindtree, organic traffic rose 18% and page speed scores went from 55 to 88.',
  },
  {
    keys: ['ai', 'llm', 'voice', 'agent'],
    answer: 'Her AI work is personal projects: q-live (multi-tenant voice agent for clinic booking using SIP, LiveKit, Sarvam AI, Groq and Supabase), Jarvis (assistant in development), a multi-model AI chat platform, and an AI performance optimization engine. She holds Generative AI and Agentic AI certifications.',
  },
  {
    keys: ['senior', 'suitable', 'why', 'hire', 'fit'],
    answer: 'She brings 9+ years of enterprise Angular work, 3 years leading a frontend team in Canada, experience with North American clients, measurable performance results, a 90% test-coverage quality gate and CI/CD experience, plus hands-on AI and voice-agent projects.',
  },
  {
    keys: ['lead', 'team'],
    answer: 'Her resume states 3 years leading a frontend team in Canada, working directly with North American clients and cross-border teams.',
  },
  {
    keys: ['contact', 'email', 'reach', 'linkedin'],
    answer: 'You can email prathyushasadhu12@gmail.com or message her on LinkedIn (linkedin.com/in/prathyusha-sadhu-39144b79).',
  },
];

export const demoFallback = 'I don’t have that in her portfolio. Please email her for details. (Demo mode: answers are predefined.)';

export function demoReply(q: string): string {
  const t = q.toLowerCase();
  return (demoAnswers.find(a => a.keys.some(k => t.includes(k))) ?? { answer: demoFallback }).answer;
}

