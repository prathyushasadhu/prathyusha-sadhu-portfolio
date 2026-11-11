// Single source of truth for the portfolio AND the AI assistant.
// Every fact below comes from Prathyusha's resume or verified background.
// "TODO(prathyusha)" = a detail the resume does not contain. Render these as visible placeholders; never invent them.

export type Status = 'Production (client)' | 'Deployed (personal project)' | 'Prototype' | 'In development' | 'Architecture designed';

export interface Metric {
  label: string;
  value: string;
  source: 'resume';
  verified: boolean;
}

export interface ArchNode {
  id: string;
  label: string;
  tech: string;
  responsibility: string;
  flow: string;
  decision: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  lab: 'engineering' | 'ai';
  kind: 'Professional' | 'Personal';
  context: string;
  problem: string;
  existing: string;
  challenges: string[];
  contribution: string[];
  architecture: ArchNode[];
  tech: string[];
  tradeoffs: string;
  results: Metric[];
  takeaways: string;
}

export interface Product {
  name: string;
  status: Status;
  problem: string;
  audience: string;
  features: string[];
  tech: string[];
  repo?: string;
}

export interface ProjectCard {
  id: string;
  labId: 'engineering' | 'ai' | 'product';
  kind: 'pro' | 'ind';
  accent: string;
  subtitle: string;
  title: string;
  orbitLabel: string;
  description: string;
  tech: string[];
  metrics: string[];
  flow?: string[];
  githubUrl?: string;
  caseStudySlug?: string;
}

export const profile = {
  name: 'Prathyusha Sadhu',
  headline: 'Senior Frontend Engineer | AI Product Builder | Technology Explorer',
  tagline: 'Engineering the next possibility.',
  statement: 'I build scalable digital experiences and explore what happens when engineering meets intelligence.',
  summary:
    'Senior Frontend Engineer with 9+ years building enterprise-grade Angular applications, including 3 years leading a frontend team in Canada. Specializes in TypeScript, RxJS and NgRx, with recent focus on integrating Generative AI, conversational interfaces and voice agents into production systems. Experienced working directly with North American clients and cross-border teams.',
  location: 'Hyderabad, India',
  email: 'prathyushasadhu12@gmail.com',
  linkedin: 'https://linkedin.com/in/prathyusha-sadhu-39144b79',
  github: 'https://github.com/prathyushasadhu',
  resumePdf: '/assets/Prathyusha_Sadhu_Resume.pdf',
  avatar: {
    src: '/assets/profile/avatar-480.webp',
    src2x: '/assets/profile/avatar-240.webp',
    alt: 'Portrait of Prathyusha Sadhu',
  },
  aboutBanner: {
    src: '/assets/profile/about-banner-1200.webp',
    small: '/assets/profile/about-banner-600.webp',
    alt: 'Prathyusha at a lakeside at sunset',
    caption: 'Lakeside sunset reflection',
  },
};

export const studios = [
  { id: 'engineering', name: 'Engineering Lab', accent: '#73B6FF', blurb: 'Enterprise Angular, performance and architecture.' },
  { id: 'ai', name: 'AI Lab', accent: '#8B72E8', blurb: 'Voice agents, LLM integrations and agentic workflows.' },
  { id: 'product', name: 'Product Studio', accent: '#36C9A0', blurb: 'Prototypes and independent products, labelled honestly.' },
] as const;

export const verifiedStats = [
  { value: '9+', label: 'years of enterprise frontend engineering' },
  { value: 'v8–19', label: 'Angular, with TypeScript, RxJS and NgRx' },
  { value: '3 yrs', label: 'leading a frontend team in Canada' },
  { value: '2', label: 'countries, working directly with North American clients' },
  { value: '90+', label: 'Lighthouse 90+ on enterprise apps' },
];

export const timeline = [
  {
    id: 'infosys',
    employer: 'Infosys Limited',
    role: 'Technology Analyst',
    period: 'Sep 2021 – Mar 2026',
    client: 'A US telecom client',
    location: 'Hyderabad, India (Sep 2021 – Apr 2023) → Canada (May 2023 – Mar 2026)',
    responsibilities: [
      'Developed and enhanced enterprise Angular applications for a US telecom client, building reusable UI components and integrating REST APIs with TypeScript, RxJS and NgRx.',
      'Designed and implemented 30+ reusable UI components to reduce code duplication and accelerate delivery.',
      'Implemented dynamic image resizing and optimization for AEM DAM hero images using Dynamic Media with configurable width and quality parameters.',
      'Investigated and resolved Google Pay and Apple Pay token integration issues across environments using Splunk, browser debugging and API/network analysis.',
      'Implemented SEO requirements (titles, meta descriptions, canonical URLs) and Google Tag Manager integration.',
      'Translated Figma designs into responsive Angular components across desktop, tablet and mobile.',
      'Implemented NgRx-based state management for complex business workflows.',
      'Maintained a 90% code-coverage quality gate (SonarQube) with Jasmine, Karma and Jest.',
      'Established and maintained CI/CD pipelines (GitHub Actions / Azure DevOps).',
      'Achieved Lighthouse performance scores of 90+, improved LCP from ~4s to under 2.2s and reduced bundle size by 30% via lazy loading, code-splitting and module optimization.',
    ],
    tech: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'AEM', 'Jasmine', 'Karma', 'Jest', 'SonarQube', 'GitHub Actions', 'Azure DevOps', 'Postman', 'SoapUI', 'Splunk', 'Figma'],
  },
  {
    id: 'mindtree',
    employer: 'Mindtree Limited',
    role: 'Senior Software Engineer',
    period: 'Jul 2016 – Sep 2021',
    client: 'Multiple client engagements',
    clients: [
      { descriptor: 'A global technology company', period: 'Jun 2018 – Sep 2021' },
      { descriptor: 'A retail technology company', period: 'Mar 2018 – Jun 2018' },
      { descriptor: 'A global automotive company', period: 'Mar 2017 – Feb 2018' },
      { descriptor: 'A digital security company', period: 'Nov 2016 – Mar 2017' },
    ],
    location: 'India',
    responsibilities: [
      'Developed product front ends with HTML5, CSS3, Bootstrap and jQuery; built responsive interfaces for cross-device use.',
      'Led frontend modernization initiatives for enterprise platforms with modular, reusable Angular components.',
      'Built component libraries adopted across multiple business modules.',
      'Improved SEO and page speed: 18% increase in organic traffic, page speed score from 55 to 88.',
      'Worked in Agile/Scrum (sprint planning, stand-ups, reviews) and communicated directly with clients.',
    ],
    tech: ['Angular', 'HTML5', 'CSS3', 'Bootstrap', 'jQuery', 'Agile/Scrum'],
  },
];

export const education = {
  degree: 'B.Tech / B.E. Computer Science and Engineering',
  school: 'Koneru Lakshmaiah Education Foundation, Guntur',
  period: '2012 – 2016',
  grade: '8.9/10',
};

export const certifications = [
  'Generative AI — Outskill',
  'Understanding Agentic AI — Agent Academy',
];

export const skills = {
  'Frameworks & Libraries': ['Angular (v8–19)', 'TypeScript', 'JavaScript', 'NgRx', 'RxJS', 'jQuery', 'Bootstrap', 'Material UI', 'Tailwind CSS'],
  'Web Technologies': ['HTML5', 'CSS3/SASS/SCSS', 'AJAX', 'XML', 'JSON', 'REST', 'SOAP'],
  'AI & Prompt Engineering': ['Conversational AI', 'Voice agents', 'Prompt engineering', 'Claude', 'GitHub Copilot', 'Cursor', 'Codex'],
  'Cloud & DevOps': ['Azure', 'AEM', 'Docker', 'GitHub Actions', 'Azure DevOps', 'Jenkins', 'Webpack', 'NPM', 'Grunt', 'Maven'],
  'Testing': ['Jasmine', 'Karma', 'Jest', 'Cypress', 'React Testing Library', 'Postman', 'SoapUI'],
  'Design & Collaboration': ['Figma', 'Responsive design', 'Web accessibility', 'Git', 'Bitbucket', 'Confluence', 'JIRA', 'ServiceNow'],
};

const TODO = (what: string) => `TODO(prathyusha): ${what}`;

export const caseStudies: CaseStudy[] = [
  {
    slug: 'web-performance',
    title: 'Core Web Vitals on an enterprise telecom front end',
    lab: 'engineering',
    kind: 'Professional',
    context: 'Enterprise Angular applications for a US telecom client (Infosys).',
    problem: 'Pages needed better load performance and Core Web Vitals.',
    existing: TODO('how the app was structured before optimization (modules, bundle layout)'),
    challenges: [TODO('2–3 real technical challenges')],
    contribution: [
      'Lazy loading, code-splitting and module optimization.',
      'Dynamic image resizing for AEM DAM hero images via Dynamic Media with configurable width and quality.',
    ],
    architecture: [],
    tech: ['Angular', 'TypeScript', 'AEM Dynamic Media', 'Lighthouse'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [
      { label: 'Lighthouse performance', value: '90+', source: 'resume', verified: true },
      { label: 'LCP', value: '~4s → under 2.2s', source: 'resume', verified: true },
      { label: 'Bundle size', value: '−30%', source: 'resume', verified: true },
    ],
    takeaways: TODO('key takeaways'),
  },
  {
    slug: 'component-library',
    title: 'Reusable component libraries',
    lab: 'engineering',
    kind: 'Professional',
    context: 'Enterprise platforms at Mindtree and a telecom client at Infosys.',
    problem: 'Duplicated UI code slowed delivery across modules.',
    existing: TODO('what existed before'),
    challenges: [TODO('real challenges')],
    contribution: [
      'Built component libraries adopted across multiple business modules (Mindtree).',
      'Designed 30+ reusable UI components (Infosys).',
      'Mapped Figma designs to responsive Angular components.',
    ],
    architecture: [],
    tech: ['Angular', 'TypeScript', 'SCSS', 'Figma'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [
      { label: 'Reusable components (Infosys)', value: '30+', source: 'resume', verified: true },
    ],
    takeaways: TODO('key takeaways'),
  },
  {
    slug: 'ngrx-quality',
    title: 'NgRx state and a 90% coverage quality gate',
    lab: 'engineering',
    kind: 'Professional',
    context: 'Complex business workflows on an enterprise telecom front end.',
    problem: 'Complex workflow state needed to be predictable and maintainable.',
    existing: TODO('what existed before'),
    challenges: [TODO('real challenges')],
    contribution: [
      'NgRx-based state management for complex workflows.',
      'Unit/integration tests (Jasmine, Karma, Jest) above the 90% SonarQube gate.',
      'CI/CD pipelines with GitHub Actions / Azure DevOps.',
    ],
    architecture: [],
    tech: ['NgRx', 'RxJS', 'Jest', 'SonarQube', 'GitHub Actions', 'Azure DevOps'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [
      { label: 'Coverage quality gate', value: '90%', source: 'resume', verified: true },
    ],
    takeaways: TODO('key takeaways'),
  },
  {
    slug: 'payment-integration',
    title: 'Google Pay and Apple Pay token integration debugging',
    lab: 'engineering',
    kind: 'Professional',
    context: 'Payment flows on an enterprise telecom front end (Infosys).',
    problem: 'Google Pay and Apple Pay token integration issues appeared across environments.',
    existing: TODO('how the payment flow was structured'),
    challenges: [TODO('real challenges')],
    contribution: [
      'Investigated and resolved token integration issues across environments using Splunk, browser debugging and API/network analysis.',
    ],
    architecture: [],
    tech: ['Splunk', 'REST APIs', 'Browser DevTools'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [],
    takeaways: TODO('key takeaways'),
  },
  {
    slug: 'aem-image-optimization',
    title: 'AEM Dynamic Media image optimization',
    lab: 'engineering',
    kind: 'Professional',
    context: 'Hero imagery managed in AEM DAM for a telecom front end (Infosys).',
    problem: 'Large hero images hurt page performance and Core Web Vitals.',
    existing: TODO('how images were served before'),
    challenges: [TODO('real challenges')],
    contribution: [
      'Implemented dynamic image resizing and optimization for AEM DAM hero images using Dynamic Media, with configurable width and quality parameters, reducing image payload.',
    ],
    architecture: [],
    tech: ['AEM', 'Dynamic Media', 'Angular'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [],
    takeaways: TODO('key takeaways'),
  },
  {
    slug: 'seo-page-speed',
    title: 'SEO and page speed at Mindtree',
    lab: 'engineering',
    kind: 'Professional',
    context: 'Enterprise client platforms (Mindtree).',
    problem: 'Low organic traffic and slow pages.',
    existing: TODO('what existed before'),
    challenges: [TODO('real challenges')],
    contribution: ['SEO improvements and page-speed work.'],
    architecture: [],
    tech: ['HTML5', 'CSS3', 'Angular'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [
      { label: 'Organic traffic', value: '+18%', source: 'resume', verified: true },
      { label: 'Page speed score', value: '55 → 88', source: 'resume', verified: true },
    ],
    takeaways: TODO('key takeaways'),
  },
  {
    slug: 'q-live',
    title: 'q-live: multi-tenant voice AI for clinic appointment booking',
    lab: 'ai',
    kind: 'Personal',
    context: 'Phone-based appointment booking for clinics, with Telugu speech support.',
    problem: 'Clinics need appointment booking by phone, per clinic, in the caller’s language.',
    existing: 'New design (personal project).',
    challenges: ['Multi-tenant configuration per clinic', 'Telugu speech-to-text and text-to-speech'],
    contribution: [
      'Designed the multi-tenant voice AI architecture.',
      'Each clinic has its own phone number, greeting, prompt configuration and appointment data.',
      'Explored patent filing, including India-specific patentability under Section 3(k).',
    ],
    architecture: [
      { id: 'sip', label: 'SIP telephony', tech: 'SIP', responsibility: 'Receives the clinic’s phone call.', flow: 'Caller → LiveKit', decision: TODO('why SIP') },
      { id: 'livekit', label: 'LiveKit', tech: 'LiveKit', responsibility: 'Real-time audio session.', flow: 'SIP ↔ speech services', decision: TODO('why LiveKit') },
      { id: 'speech', label: 'Speech (Telugu)', tech: 'Sarvam AI', responsibility: 'Telugu speech-to-text and text-to-speech.', flow: 'Audio ↔ text', decision: TODO('why Sarvam AI') },
      { id: 'llm', label: 'Conversation + booking logic', tech: 'Groq LLM', responsibility: 'Conversation and appointment logic.', flow: 'Text → Supabase', decision: TODO('why Groq') },
      { id: 'db', label: 'Tenant data', tech: 'Supabase', responsibility: 'Per-clinic phone number, greeting, prompt config and appointments.', flow: 'Read config / write appointments', decision: TODO('tenancy model') },
    ],
    tech: ['SIP', 'LiveKit', 'Sarvam AI', 'Groq', 'Supabase'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [],
    takeaways: TODO('lessons learned'),
  },
  {
    slug: 'multi-model-chat',
    title: 'Multi-model AI chat and customer support platform',
    lab: 'ai',
    kind: 'Personal',
    context: 'Personal project: an intelligent support chatbot.',
    problem: 'Improve response relevance and resolution.',
    existing: TODO('n/a or details'),
    challenges: [TODO('real challenges')],
    contribution: [
      'Dynamic model switching between Claude, GPT-4 and domain models.',
      'Role-based system prompts and prompt engineering.',
      'Sentiment analysis to reduce escalation time.',
    ],
    architecture: [],
    tech: ['Claude', 'GPT-4', 'Prompt engineering', 'Sentiment analysis'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [
      { label: 'Monthly conversations', value: '10,000+', source: 'resume', verified: false },
      { label: 'First-contact resolution', value: '85%', source: 'resume', verified: false },
      { label: 'Escalation time', value: '−45%', source: 'resume', verified: false },
    ],
    takeaways: TODO('lessons learned'),
  },
  {
    slug: 'perf-optimization-engine',
    title: 'AI-assisted performance optimization engine',
    lab: 'ai',
    kind: 'Personal',
    context: 'Personal project: tooling for frontend performance.',
    problem: 'Finding bundle and loading bottlenecks automatically.',
    existing: TODO('n/a or details'),
    challenges: [TODO('real challenges')],
    contribution: [
      'Automated tool that identifies frontend performance bottlenecks and recommends code-splitting and lazy-loading.',
      'ML-based bundle analyzer.',
    ],
    architecture: [],
    tech: ['ML', 'Bundle analysis', 'Core Web Vitals'],
    tradeoffs: TODO('decisions and trade-offs'),
    results: [
      { label: 'Average Core Web Vitals improvement', value: '42%', source: 'resume', verified: false },
    ],
    takeaways: TODO('lessons learned'),
  },
];

// Per approval: Product Studio shows Jarvis and Stock Analyzer only (q-live stays in AI Lab only)
export const products: Product[] = [
  {
    name: 'Jarvis',
    status: 'In development',
    problem: 'A personal assistant for voice-controlled task management, calendar and email automation, and reminders.',
    audience: TODO('target audience'),
    features: [
      'Speech recognition and NLP',
      'Context-aware conversational AI with memory',
      'Agentic workflows for multi-step tasks',
    ],
    tech: ['Angular', 'TypeScript', 'Web Speech API', 'Claude API'],
  },
  {
    name: 'Stock Analyzer',
    status: 'Deployed (personal project)',
    problem: 'Scan the Indian equity market and surface rule-based buy/sell scores.',
    audience: TODO('target audience'),
    features: [
      'Nifty Total Market (~750 stocks) and NSE+BSE (~7,800) coverage',
      'Sector-grouped results',
      'Candlestick patterns, EMA/RSI overlays, swing-trading analysis',
    ],
    tech: ['Python', 'Streamlit', 'Render'],
    repo: 'https://github.com/prathyushasadhu/stock-analyzer',
  },
];

// Unified project cards for display and orbit
export const projectCards: ProjectCard[] = [
  // Engineering Lab
  {
    id: 'pj-eng-arch',
    labId: 'engineering',
    kind: 'pro',
    accent: '#22D3EE',
    subtitle: 'Infosys · US telecom client',
    title: 'Angular architecture and reusable UI',
    orbitLabel: 'Angular Architecture',
    description: 'Enterprise Angular applications with TypeScript, RxJS and NgRx state management for complex business workflows. Designed 30+ reusable components and turned Figma designs into responsive layouts.',
    tech: ['Angular', 'NgRx', 'RxJS', 'Figma'],
    metrics: ['30+ components', '90% coverage gate'],
    caseStudySlug: 'component-library',
  },
  {
    id: 'pj-eng-cwv',
    labId: 'engineering',
    kind: 'pro',
    accent: '#34D399',
    subtitle: 'Infosys · US telecom client',
    title: 'Core Web Vitals and performance',
    orbitLabel: 'Web Performance',
    description: 'Lazy loading, code-splitting and module optimization on a telecom front end.',
    tech: ['Angular', 'Lighthouse'],
    metrics: ['Lighthouse 90+', 'LCP ~4s → under 2.2s', 'Bundle −30%'],
    caseStudySlug: 'web-performance',
  },
  {
    id: 'pj-eng-pay',
    labId: 'engineering',
    kind: 'pro',
    accent: '#2DD4BF',
    subtitle: 'Infosys · US telecom client',
    title: 'Payment integration debugging',
    orbitLabel: 'Payments',
    description: 'Investigated and resolved Google Pay and Apple Pay token integration issues across environments using Splunk, browser debugging and API/network analysis.',
    tech: ['Splunk', 'REST', 'DevTools'],
    metrics: [],
    caseStudySlug: 'payment-integration',
  },
  {
    id: 'pj-eng-aem',
    labId: 'engineering',
    kind: 'pro',
    accent: '#F59E0B',
    subtitle: 'Infosys · US telecom client',
    title: 'AEM image optimization',
    orbitLabel: 'AEM Images',
    description: 'Dynamic image resizing for AEM DAM hero images using Dynamic Media, with configurable width and quality, reducing image payload and improving Core Web Vitals.',
    tech: ['AEM', 'Dynamic Media'],
    metrics: [],
    caseStudySlug: 'aem-image-optimization',
  },
  {
    id: 'pj-journey-edu',
    labId: 'engineering',
    kind: 'pro',
    accent: '#3B82F6',
    subtitle: 'Education & Certifications',
    title: 'Education and certifications',
    orbitLabel: 'Education',
    description: 'B.Tech in Computer Science and Engineering (8.9/10) from KL University, and certifications in Generative AI and Understanding Agentic AI.',
    tech: ['Computer Science', 'Generative AI', 'Agentic AI'],
    metrics: ['8.9/10 Grade', '2 AI Certifications'],
  },

  // AI Lab
  {
    id: 'pj-ai-qlive',
    labId: 'ai',
    kind: 'ind',
    accent: '#F472B6',
    subtitle: 'Independent project',
    title: 'q-live: voice AI for clinic booking',
    orbitLabel: 'q-live',
    description: 'A multi-tenant voice agent for phone appointment booking, with Telugu speech support. Each clinic gets its own number, greeting, prompts and data.',
    tech: ['LiveKit', 'Sarvam AI', 'Groq', 'Supabase'],
    metrics: [],
    flow: ['SIP', 'LiveKit', 'Sarvam STT/TTS', 'Groq LLM', 'Supabase'],
    caseStudySlug: 'q-live',
  },
  {
    id: 'pj-ai-chat',
    labId: 'ai',
    kind: 'ind',
    accent: '#A855F7',
    subtitle: 'Independent project',
    title: 'Multi-model AI chat platform',
    orbitLabel: 'AI Chat',
    description: 'A support chatbot that switches dynamically between Claude, GPT-4 and domain models, with role-based system prompts and sentiment analysis.',
    tech: ['Claude', 'GPT-4', 'Prompt engineering'],
    metrics: ['10,000+ chats/mo (self-reported)', '85% FCR (self-reported)', '−45% escalation (self-reported)'],
    caseStudySlug: 'multi-model-chat',
  },
  {
    id: 'pj-ai-perf',
    labId: 'ai',
    kind: 'ind',
    accent: '#8B5CF6',
    subtitle: 'Independent project',
    title: 'AI performance optimization engine',
    orbitLabel: 'Perf Engine',
    description: 'A tool that finds frontend bottlenecks and recommends code-splitting and lazy-loading, using an ML-based bundle analyzer.',
    tech: ['ML', 'Bundle analysis'],
    metrics: ['42% avg. CWV gain (self-reported)'],
    caseStudySlug: 'perf-optimization-engine',
  },

  // Product Studio (Jarvis & Stock Analyzer)
  {
    id: 'pj-prod-jarvis',
    labId: 'product',
    kind: 'ind',
    accent: '#3B82F6',
    subtitle: 'In development · Independent',
    title: 'Jarvis: AI personal assistant',
    orbitLabel: 'Jarvis',
    description: 'Voice-controlled task, calendar and email automation with context-aware conversation, memory and agentic workflows.',
    tech: ['Angular', 'Web Speech API', 'Claude API'],
    metrics: [],
  },
  {
    id: 'pj-prod-stock',
    labId: 'product',
    kind: 'ind',
    accent: '#F59E0B',
    subtitle: 'Deployed · Independent',
    title: 'Stock Analyzer',
    orbitLabel: 'Stock Analyzer',
    description: 'A Python/Streamlit scanner for Indian equities (~750 Nifty stocks, ~7,800 NSE+BSE) with candlestick patterns, EMA/RSI overlays and rule-based scores.',
    tech: ['Python', 'Streamlit', 'Render'],
    metrics: [],
    githubUrl: 'https://github.com/prathyushasadhu/stock-analyzer',
  },
];

