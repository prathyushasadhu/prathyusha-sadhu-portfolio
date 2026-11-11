// Serverless function (Vercel/Netlify style). Set ANTHROPIC_API_KEY in the host's environment, never in frontend code.
import { profile, timeline, caseStudies, products, skills, education, certifications } from '../content';
import systemTemplate from '../assistant-system-prompt.md?raw'; // adjust loader to your host
const CONTEXT = JSON.stringify({ profile: { ...profile, photo: undefined }, timeline, caseStudies, products, skills, education, certifications });
const buckets = new Map<string, { n: number; t: number }>();

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const b = buckets.get(ip) ?? { n: 0, t: Date.now() };
  if (Date.now() - b.t > 60_000) { b.n = 0; b.t = Date.now(); }
  if (++b.n > 8) return new Response('Rate limited', { status: 429 });
  buckets.set(ip, b);
  const { question } = await req.json();
  if (typeof question !== 'string' || question.length > 500) return new Response('Bad request', { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ demo: true });
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5-5', max_tokens: 400, system: systemTemplate.replace('{{CONTENT_JSON}}', CONTEXT), messages: [{ role: 'user', content: question }] }),
  });
  const data = await r.json();
  return Response.json({ demo: false, answer: data.content?.[0]?.text ?? 'Sorry, something went wrong.' });
}
