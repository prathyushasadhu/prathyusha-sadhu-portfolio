import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { timeline, education, certifications, profile } from '../../core/portfolio.data';

export interface MilestoneHighlight {
  value: string;
  label: string;
}

export interface ClientEngagement {
  descriptor: string;
  period: string;
}

export interface JourneyMilestone {
  id: string;
  period: string;
  employer: string;
  role: string;
  clientLine: string;
  location?: string;
  routeChip?: {
    from: string;
    to: string;
    periodDetails: string;
  };
  clients?: ClientEngagement[];
  highlights: MilestoneHighlight[];
  responsibilities: string[];
  tech: string[];
  isOpenByDefault: boolean;
  accentColor: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @ViewChild('railFill') railFillRef?: ElementRef<HTMLElement>;
  @ViewChild('miniMeMarker') miniMeMarkerRef?: ElementRef<HTMLElement>;
  @ViewChild('journeyContainer') journeyContainerRef?: ElementRef<HTMLElement>;

  profile = profile;
  private scrollTriggers: any[] = [];

  // Mini-me pixel matrix (12x12)
  readonly pixelGrid: Array<{ x: number; y: number; fill: string }> = [
    { x: 3, y: 0, fill: '#1a1226' }, { x: 4, y: 0, fill: '#1a1226' }, { x: 5, y: 0, fill: '#1a1226' }, { x: 6, y: 0, fill: '#1a1226' }, { x: 7, y: 0, fill: '#1a1226' }, { x: 8, y: 0, fill: '#1a1226' },
    { x: 2, y: 1, fill: '#1a1226' }, { x: 3, y: 1, fill: '#1a1226' }, { x: 4, y: 1, fill: '#1a1226' }, { x: 5, y: 1, fill: '#1a1226' }, { x: 6, y: 1, fill: '#1a1226' }, { x: 7, y: 1, fill: '#1a1226' }, { x: 8, y: 1, fill: '#1a1226' }, { x: 9, y: 1, fill: '#1a1226' },
    { x: 1, y: 2, fill: '#1a1226' }, { x: 2, y: 2, fill: '#1a1226' }, { x: 3, y: 2, fill: '#c98f6b' }, { x: 4, y: 2, fill: '#c98f6b' }, { x: 5, y: 2, fill: '#c98f6b' }, { x: 6, y: 2, fill: '#c98f6b' }, { x: 7, y: 2, fill: '#c98f6b' }, { x: 8, y: 2, fill: '#c98f6b' }, { x: 9, y: 2, fill: '#1a1226' }, { x: 10, y: 2, fill: '#1a1226' },
    { x: 1, y: 3, fill: '#1a1226' }, { x: 2, y: 3, fill: '#1a1226' }, { x: 3, y: 3, fill: '#c98f6b' }, { x: 4, y: 3, fill: '#c98f6b' }, { x: 5, y: 3, fill: '#d6303c' }, { x: 6, y: 3, fill: '#c98f6b' }, { x: 7, y: 3, fill: '#c98f6b' }, { x: 8, y: 3, fill: '#c98f6b' }, { x: 9, y: 3, fill: '#1a1226' }, { x: 10, y: 3, fill: '#1a1226' },
    { x: 1, y: 4, fill: '#1a1226' }, { x: 2, y: 4, fill: '#1a1226' }, { x: 3, y: 4, fill: '#c98f6b' }, { x: 4, y: 4, fill: '#0b0b12' }, { x: 5, y: 4, fill: '#c98f6b' }, { x: 6, y: 4, fill: '#c98f6b' }, { x: 7, y: 4, fill: '#0b0b12' }, { x: 8, y: 4, fill: '#c98f6b' }, { x: 9, y: 4, fill: '#1a1226' }, { x: 10, y: 4, fill: '#1a1226' },
    { x: 1, y: 5, fill: '#1a1226' }, { x: 2, y: 5, fill: '#1a1226' }, { x: 3, y: 5, fill: '#c98f6b' }, { x: 4, y: 5, fill: '#c98f6b' }, { x: 5, y: 5, fill: '#c98f6b' }, { x: 6, y: 5, fill: '#c98f6b' }, { x: 7, y: 5, fill: '#c98f6b' }, { x: 8, y: 5, fill: '#c98f6b' }, { x: 9, y: 5, fill: '#1a1226' }, { x: 10, y: 5, fill: '#1a1226' },
    { x: 1, y: 6, fill: '#1a1226' }, { x: 2, y: 6, fill: '#1a1226' }, { x: 3, y: 6, fill: '#c98f6b' }, { x: 4, y: 6, fill: '#c98f6b' }, { x: 5, y: 6, fill: '#c98f6b' }, { x: 6, y: 6, fill: '#7a2e2e' }, { x: 7, y: 6, fill: '#c98f6b' }, { x: 8, y: 6, fill: '#c98f6b' }, { x: 9, y: 6, fill: '#1a1226' }, { x: 10, y: 6, fill: '#1a1226' },
    { x: 2, y: 7, fill: '#1a1226' }, { x: 3, y: 7, fill: '#c98f6b' }, { x: 4, y: 7, fill: '#c98f6b' }, { x: 5, y: 7, fill: '#c98f6b' }, { x: 6, y: 7, fill: '#c98f6b' }, { x: 7, y: 7, fill: '#c98f6b' }, { x: 8, y: 7, fill: '#c98f6b' }, { x: 9, y: 7, fill: '#1a1226' },
    { x: 4, y: 8, fill: '#c98f6b' }, { x: 5, y: 8, fill: '#c98f6b' }, { x: 6, y: 8, fill: '#c98f6b' }, { x: 7, y: 8, fill: '#c98f6b' },
    { x: 2, y: 9, fill: '#b4303c' }, { x: 3, y: 9, fill: '#b4303c' }, { x: 4, y: 9, fill: '#b4303c' }, { x: 5, y: 9, fill: '#b4303c' }, { x: 6, y: 9, fill: '#b4303c' }, { x: 7, y: 9, fill: '#b4303c' }, { x: 8, y: 9, fill: '#b4303c' }, { x: 9, y: 9, fill: '#b4303c' },
    { x: 1, y: 10, fill: '#b4303c' }, { x: 2, y: 10, fill: '#b4303c' }, { x: 3, y: 10, fill: '#b4303c' }, { x: 4, y: 10, fill: '#b4303c' }, { x: 5, y: 10, fill: '#b4303c' }, { x: 6, y: 10, fill: '#b4303c' }, { x: 7, y: 10, fill: '#b4303c' }, { x: 8, y: 10, fill: '#b4303c' }, { x: 9, y: 10, fill: '#b4303c' }, { x: 10, y: 10, fill: '#b4303c' },
    { x: 0, y: 11, fill: '#b4303c' }, { x: 1, y: 11, fill: '#b4303c' }, { x: 2, y: 11, fill: '#b4303c' }, { x: 3, y: 11, fill: '#b4303c' }, { x: 4, y: 11, fill: '#b4303c' }, { x: 5, y: 11, fill: '#b4303c' }, { x: 6, y: 11, fill: '#b4303c' }, { x: 7, y: 11, fill: '#b4303c' }, { x: 8, y: 11, fill: '#b4303c' }, { x: 9, y: 11, fill: '#b4303c' }, { x: 10, y: 11, fill: '#b4303c' }, { x: 11, y: 11, fill: '#b4303c' },
  ];

  milestones: JourneyMilestone[] = [
    {
      id: 'education',
      period: '2012 – 2016',
      employer: education.school,
      role: education.degree,
      clientLine: 'Undergraduate Degree · Computer Science & Engineering',
      location: 'Guntur, India',
      highlights: [
        { value: '8.9', label: 'Graduation grade (8.9/10 GPA)' },
      ],
      responsibilities: [
        `Graduated with a Bachelor of Technology in Computer Science and Engineering with an academic grade of ${education.grade}.`,
        'Built core competency in algorithms, data structures, object-oriented software engineering, database systems, and web architectures.',
        'Engineered foundational academic applications and algorithmic problem sets.',
      ],
      tech: ['Computer Science', 'Algorithms', 'Data Structures', 'Software Engineering', 'Web Technologies'],
      isOpenByDefault: false,
      accentColor: '#9AA8C1',
    },
    {
      id: 'mindtree',
      period: timeline[1].period,
      employer: timeline[1].employer,
      role: timeline[1].role,
      clientLine: 'Four client engagements (Global Tech, Retail Tech, Automotive, Digital Security)',
      location: timeline[1].location,
      clients: timeline[1].clients,
      highlights: [
        { value: '4', label: 'client engagements' },
        { value: '+18%', label: 'organic traffic' },
        { value: '55→88', label: 'page speed uplift' },
        { value: '5 yrs', label: 'engineering tenure' },
      ],
      responsibilities: timeline[1].responsibilities,
      tech: timeline[1].tech,
      isOpenByDefault: false,
      accentColor: '#36C9A0',
    },
    {
      id: 'infosys',
      period: timeline[0].period,
      employer: timeline[0].employer,
      role: timeline[0].role,
      clientLine: `Client: ${timeline[0].client}`,
      location: timeline[0].location,
      routeChip: {
        from: 'Hyderabad, India',
        to: 'Canada',
        periodDetails: 'Sep 2021 – Apr 2023, then May 2023 – Mar 2026',
      },
      highlights: [
        { value: '30+', label: 'reusable components' },
        { value: '90%', label: 'coverage gate' },
        { value: '−30%', label: 'bundle size' },
        { value: 'under 2.2s', label: 'LCP (from ~4s)' },
      ],
      responsibilities: timeline[0].responsibilities,
      tech: timeline[0].tech,
      isOpenByDefault: true,
      accentColor: '#73B6FF',
    },
    {
      id: 'today',
      period: '2024 – Present',
      employer: 'Independent AI Projects',
      role: 'AI Product Builder & Technology Explorer',
      clientLine: 'Independent work · Self-directed research & prototypes',
      location: 'Hyderabad, India',
      highlights: [
        { value: '5', label: 'independent projects' },
        { value: '2', label: 'AI certifications' },
      ],
      responsibilities: [
        'Designed and architected q-live: a multi-tenant voice AI system for phone clinic appointment booking with Telugu speech support via LiveKit, Sarvam AI, Groq LLM, and Supabase.',
        'Developing Jarvis: an intelligent personal assistant for voice-controlled task management, calendar/email automation, and agentic workflows using Angular and Claude API.',
        'Engineered and deployed Stock Analyzer: an equity scanner for ~750 Nifty stocks and ~7,800 NSE+BSE listings with candlestick patterns and EMA/RSI overlays in Python/Streamlit.',
        'Prototyped a multi-model customer support platform with dynamic switching between Claude, GPT-4, and domain models using role-based system prompts and sentiment analysis.',
        'Developed an AI performance optimization engine identifying frontend bundle bottlenecks and recommending code-splitting and Core Web Vitals improvements.',
        `Completed professional certifications: ${certifications[0]} and ${certifications[1]}.`,
      ],
      tech: ['Claude', 'LiveKit', 'Sarvam AI', 'Groq', 'Supabase', 'Python', 'Streamlit', 'Web Speech API', 'Angular'],
      isOpenByDefault: true,
      accentColor: '#8B72E8',
    },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => this.initJourneyScroll(), { timeout: 3500 });
      } else {
        setTimeout(() => this.initJourneyScroll(), 1200);
      }
    }
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st?.kill?.());
  }

  private async initJourneyScroll(): Promise<void> {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    try {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);

      const container = this.journeyContainerRef?.nativeElement;
      const railFill = this.railFillRef?.nativeElement;
      const marker = this.miniMeMarkerRef?.nativeElement;

      if (!container || !railFill || !marker) {
        return;
      }

      // 1. Scroll-driven rail fill & traveling pixel mini-me marker
      const trackHeight = container.clientHeight - 40;
      const railSt = ScrollTrigger.create({
        trigger: container,
        start: 'top 75%',
        end: 'bottom 80%',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(railFill, { scaleY: progress, transformOrigin: 'top center' });
          gsap.set(marker, { y: progress * trackHeight });
        },
      });
      this.scrollTriggers.push(railSt);

      // 2. Slide in cards and glow dots as they enter viewport
      const cards = container.querySelectorAll('.milestone-card');
      cards.forEach((card) => {
        const dot = card.querySelector('.milestone-node-dot');
        const st = ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          end: 'bottom 30%',
          onEnter: () => {
            gsap.from(card, {
              y: 35,
              opacity: 0,
              duration: 0.7,
              ease: 'power2.out',
            });
            card.classList.add('in-view');
            dot?.classList.add('glow');
          },
          onLeave: () => {
            dot?.classList.remove('glow');
          },
          onEnterBack: () => {
            dot?.classList.add('glow');
          },
          onLeaveBack: () => {
            dot?.classList.remove('glow');
          },
        });
        this.scrollTriggers.push(st);
      });
    } catch {
      // Graceful fallback for environments where GSAP is unavailable
    }
  }
}
