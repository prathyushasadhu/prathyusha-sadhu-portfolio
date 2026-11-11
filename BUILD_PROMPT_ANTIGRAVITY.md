# Build: PRATHYUSHA.HQ — Digital HQ portfolio (Angular)

You are building a production-quality personal portfolio in THIS project directory. Inspect the directory first and keep useful files.

## Source of truth (already in this folder)
- `design-reference-digital-hq.html` — the approved visual design and interactions. PRESERVE its identity: dark theme, palette, typography, layout, hero, project orbit, stats strip, project cards, animated timeline, command palette, pixel mini-me assistant. Re-implement it as Angular components; do not redesign.
- `content.ts` — the ONLY source of facts. Never invent employers, clients, metrics or responsibilities. Render every `TODO(prathyusha)` as a clearly styled "Placeholder: to be added" block.
- `_tokens.scss` — design tokens. `assistant.ts`, `assistant-system-prompt.md`, `api/assistant.ts` — assistant demo mode, grounding prompt and serverless endpoint.
- `Prathyusha_Sadhu_Resume.pdf` (phone removed) and `assets/profile/*` (avatar and About banner) — copy into `src/assets/`.

## Decisions (final)
- EXACTLY THREE studios: Engineering Lab, AI Lab, Product Studio. No Creative Studio anywhere (nav, palette, routes, pages).
- Home hero shows a PROJECT ORBIT instead of studio nodes: Digital HQ (triangle) at the centre; projects as planets on three dashed rings: Product (inner), AI (middle), Engineering (outer). Filled dot = professional project, hollow dot = independent project. Planets orbit slowly (CSS), pause on hover/focus, show name + type in a caption, and link to that project's card. Below the orbit, show tappable chips for every project (this is the touch/mobile layout). Respect prefers-reduced-motion. Optional later upgrade: a lazy-loaded Three.js version on desktop only, keeping the SVG orbit as fallback.
- Mascot: PIXEL-STYLE "mini me" bot (not an orb). A 12×12 pixel avatar with dark hair, bindi, red sweater, bobbing idle animation and blinking eyes; it is the AI assistant button (bottom-right) and speeds up while "thinking". Palette: hair #1a1226, skin #c98f6b, bindi/sweater #b4303c, eyes #0b0b12, mouth #7a2e2e. Pixel rows (h hair, s skin, b bindi, e eye, m mouth, r sweater, . empty): `...hhhhhh...`, `..hhhhhhhh..`, `.hhssssssshh`, `.hhsssbssshh`, `.hhsessseshh`, `.hhssssssshh`, `.hhsssmmsshh`, `..hsssssssh.`, `....ssss....`, `..rrrrrrrr..`, `.rrrrrrrrrr.`, `rrrrrrrrrrrr`.
- Client is always "a US telecom client". Infosys and Mindtree may be named. No phone number anywhere. No availability badge.
- Multi-Model AI Chat Platform, AI Performance Optimization Engine, q-live, Jarvis and Stock Analyzer are INDEPENDENT projects: label them. Metrics with `verified:false` display as "self-reported".
- Professional cards (Infosys) vs independent cards use different visual treatment (solid vs dashed border + badge).

## Stack
Angular 19 (standalone components, signals, lazy routes, prerendering/SSG with per-route meta + Open Graph), strict TypeScript, SCSS tokens, Angular CDK (focus/keyboard for the command palette), GSAP + ScrollTrigger (lazy-loaded; skip when reduced motion), self-hosted fonts (Space Grotesk, Inter, JetBrains Mono), Vitest, Playwright, axe-core, Lighthouse CI. Keep the app a single-page experience with section anchors plus lazy-loaded detail routes for case studies.

## Features to implement
1. Nav: Home, About, Engineering, AI, Product, Resume, Contact; active-section highlight; responsive hamburger menu; Ctrl/Cmd+K command palette (pages + "Search projects"; arrows, Enter, Esc).
2. Hero: PRATHYUSHA SADHU, "Engineering the next possibility.", supporting statement, 9+ years intro, buttons (Explore My Work, Download Resume, Contact Me), framed photo, project orbit, subtle layered ambient background.
3. Stats strip (verified only): 9+ years, Angular v8–19, 3 yrs leading a frontend team in Canada, 2 countries / North American clients, Lighthouse 90+.
4. Project cards from `content.ts`: Angular architecture and reusable UI, Core Web Vitals, payment integration debugging, AEM image optimization (professional); q-live (with data-flow chips), multi-model chat, performance engine (AI); Jarvis, Stock Analyzer (product).
5. Case-study pages for professional projects using the 10-part structure in `content.ts` (placeholders where unknown). q-live gets an interactive architecture explorer (click a node: responsibility, tech, data flow, decision).
6. Animated career timeline (Infosys, Mindtree, Education) with a GSAP scroll-drawn line and clickable milestones.
7. Resume section with PDF download, education, certifications.
8. Contact: email, LinkedIn, GitHub, form with `mailto:` fallback.
9. AI assistant (pixel mini-me): call `/api/assistant`; if it returns `{demo:true}` use `demoReply()` and show a visible "Demo mode" label. API key only via environment variable, never in frontend code.

## Quality bar
Responsive at 360–767 / 768–1023 / 1024–1439 / 1440+. Touch-friendly (no hover-only). Semantic HTML, skip link, visible focus, reduced-motion support. Responsive WebP images, lazy loading, code splitting. Targets: Lighthouse Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+. MEASURE and report real numbers; do not assume.

## Process
Phase 1: scaffold, tokens, content model, Home. Phase 2: remaining sections and case studies. Phase 3: orbit polish, GSAP, command palette, architecture explorer. Phase 4: assistant, contact, resume. Phase 5: test (Playwright at all breakpoints), axe, Lighthouse, fix issues. After each phase run `ng build`, fix errors and keep it runnable. Show me the plan before starting.

Finish with: project structure, commands, env vars (`ANTHROPIC_API_KEY`, optional `ANTHROPIC_MODEL`, contact-form key), test and Lighthouse results, deployment steps (Vercel/Netlify/Cloudflare Pages), and a list of remaining placeholders.
