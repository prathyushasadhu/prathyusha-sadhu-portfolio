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
import { timeline, education, certifications } from '../../../../content';

export interface MilestoneHighlight {
  value: string;
  label: string;
}

export interface ClientEngagement {
  descriptor: string;
  period: string;
}

export interface CareerMilestone {
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
  selector: 'app-career-journey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './career-journey.component.html',
  styleUrls: ['./career-journey.component.scss'],
})
export class CareerJourneyComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @ViewChild('railFill') railFillRef?: ElementRef<HTMLElement>;
  @ViewChild('miniMeMarker') miniMeMarkerRef?: ElementRef<HTMLElement>;
  @ViewChild('journeyContainer') journeyContainerRef?: ElementRef<HTMLElement>;

  private scrollTriggers: any[] = [];

  // 4 Milestone Cards in strict chronological order
  milestones: CareerMilestone[] = [
    {
      id: 'education',
      period: education.period,
      employer: education.school,
      role: education.degree,
      clientLine: `Guntur, India · Grade: ${education.grade}`,
      highlights: [
        { value: '8.9', label: 'academic grade point average (8.9/10)' },
      ],
      responsibilities: [
        `Completed Bachelor of Technology in Computer Science and Engineering with an academic grade of ${education.grade}.`,
        'Built strong foundation in algorithms, data structures, object-oriented software design, database systems, and web architectures.',
        'Developed academic software projects applying core computer science fundamentals to practical engineering problems.',
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
      clientLine: 'Four client engagements · India',
      clients: timeline[1].clients,
      highlights: [
        { value: '4', label: 'client engagements' },
        { value: '+18%', label: 'organic traffic' },
        { value: '55→88', label: 'page speed uplift' },
        { value: '5 years', label: 'engineering tenure' },
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
      highlights: [
        { value: '5', label: 'independent projects' },
        { value: '2', label: 'AI certifications' },
      ],
      responsibilities: [
        'Designed and architected q-live: multi-tenant voice AI for clinic appointment booking with Telugu speech support via LiveKit, Sarvam AI, Groq LLM, and Supabase.',
        'Developing Jarvis: intelligent personal assistant for voice-controlled task management, calendar/email automation, and agentic workflows using Angular and Claude API.',
        'Engineered and deployed Stock Analyzer: Indian equity market scanner (~750 Nifty stocks, ~7,800 NSE+BSE) with candlestick patterns and EMA/RSI overlays in Python/Streamlit.',
        'Prototyped multi-model customer support platform with dynamic switching between Claude, GPT-4, and domain models using role-based system prompts and sentiment analysis.',
        'Engineered AI performance optimization engine identifying frontend bundle bottlenecks and recommending code-splitting and Core Web Vitals improvements.',
        `Completed certifications: ${certifications[0]} and ${certifications[1]}.`,
      ],
      tech: ['Claude', 'LiveKit', 'Sarvam AI', 'Groq', 'Supabase', 'Python', 'Streamlit', 'Web Speech API', 'Angular'],
      isOpenByDefault: true,
      accentColor: '#8B72E8',
    },
  ];

  private journeyObserver?: IntersectionObserver;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      const container = this.journeyContainerRef?.nativeElement;
      if (container && typeof IntersectionObserver !== 'undefined') {
        this.journeyObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) {
              this.journeyObserver?.disconnect();
              this.initJourneyScroll();
            }
          },
          { rootMargin: '250px 0px' }
        );
        this.journeyObserver.observe(container);
      } else {
        setTimeout(() => this.initJourneyScroll(), 1500);
      }
    }
  }

  ngOnDestroy(): void {
    this.journeyObserver?.disconnect();
    this.scrollTriggers.forEach((st) => st?.kill?.());
  }

  private async initJourneyScroll(): Promise<void> {
    if (
      typeof window === 'undefined' ||
      (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
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

      const cards = container.querySelectorAll('.ms');
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
      // Graceful fallback
    }
  }
}
