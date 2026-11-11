import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../core/seo.service';
import { ActiveSectionService } from '../../core/active-section.service';
import { AssistantService } from '../../core/assistant.service';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { CareerJourneyComponent } from '../../components/career-journey/career-journey.component';
import { ArchExplorerComponent } from '../../components/arch-explorer/arch-explorer.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { projectCards, ProjectCard, profile, skills, caseStudies } from '../../core/portfolio.data';

type FilterType = 'all' | 'engineering' | 'ai' | 'product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ProjectCardComponent,
    CareerJourneyComponent,
    ArchExplorerComponent,
    ContactComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private seoService = inject(SeoService);
  private activeSectionService = inject(ActiveSectionService);
  private assistantService = inject(AssistantService);
  private platformId = inject(PLATFORM_ID);

  profile = profile;
  allCards: ProjectCard[] = projectCards;
  qLiveNodes = caseStudies.find((c) => c.slug === 'q-live')?.architecture ?? [];
  selectedFilter = signal<FilterType>('all');

  filteredCards = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'all') return this.allCards;
    return this.allCards.filter((c) => c.labId === filter);
  });

  skillCategories = Object.entries(skills).map(([category, items]) => ({
    category,
    items,
  }));

  private scrollTriggers: any[] = [];
  private mm?: any;
  private pointerMoveHandler?: (e: PointerEvent) => void;

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Prathyusha Sadhu · Senior Frontend Engineer & AI Product Builder',
      description:
        'Senior Frontend Engineer with 9+ years building enterprise Angular applications and exploring AI product interfaces.',
      url: '/',
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.activeSectionService.init([
        'home',
        'project-orbit',
        'journey',
        'ai-lab',
        'skills',
        'contact',
      ]);
      this.initSpotlight();
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => this.initAnimations(), { timeout: 3500 });
      } else {
        setTimeout(() => this.initAnimations(), 1200);
      }
    }
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st?.kill?.());
    this.mm?.revert?.();
    if (this.pointerMoveHandler && typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.pointerMoveHandler);
    }
  }

  setFilter(filter: FilterType): void {
    this.selectedFilter.set(filter);
  }

  openAssistant(): void {
    this.assistantService.open();
  }

  private initSpotlight(): void {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none) or (pointer: coarse)').matches
    ) {
      return;
    }

    let ticking = false;
    this.pointerMoveHandler = (e: PointerEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--spot-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--spot-y', `${e.clientY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('pointermove', this.pointerMoveHandler, { passive: true });
  }

  private async initAnimations(): Promise<void> {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    try {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);
      this.mm = gsap.matchMedia();

      this.mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Section headings masked reveal
        const headingBatch = ScrollTrigger.batch('.masked-heading-text', {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              yPercent: 105,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.08,
            });
          },
        });
        this.scrollTriggers.push(headingBatch);

        // Staggered entrance for cards
        const cardsBatch = ScrollTrigger.batch('.project-grid app-project-card', {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              y: 28,
              opacity: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power2.out',
            });
          },
        });
        this.scrollTriggers.push(cardsBatch);
      });
    } catch {
      // Graceful fallback
    }
  }
}
