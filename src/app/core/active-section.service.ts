import {
  Injectable,
  signal,
  inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ActiveSectionService implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private scrollListener?: () => void;
  private hashListener?: () => void;
  private observedIds: string[] = [];

  readonly activeSectionId = signal<string>('home');

  init(sectionIds: string[] = ['home', 'project-orbit', 'journey', 'ai-lab', 'skills', 'contact']): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') {
      return;
    }

    this.cleanup();
    this.observedIds = sectionIds;

    // 1. IntersectionObserver with rootMargin: "-40% 0px -55% 0px"
    if (typeof IntersectionObserver !== 'undefined') {
      const options: IntersectionObserverInit = {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      };

      this.observer = new IntersectionObserver((entries) => {
        // Find visible section crossing the band
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSectionId.set(entry.target.id);
          }
        });
      }, options);

      // Attach observer to each element
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          this.observer?.observe(el);
        }
      });
    }

    // 2. Bottom of page handler (highlight contact when scrollY + innerHeight >= scrollHeight - 2)
    this.scrollListener = () => {
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollY + innerHeight >= scrollHeight - 2) {
        this.activeSectionId.set('contact');
      }
    };
    window.addEventListener('scroll', this.scrollListener, { passive: true });

    // 3. Hash change handler
    this.hashListener = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (this.observedIds.includes(rawHash)) {
        this.activeSectionId.set(rawHash);
      }
    };
    window.addEventListener('hashchange', this.hashListener, { passive: true });

    // Initial check from current hash
    const initialHash = window.location.hash.replace('#', '');
    if (this.observedIds.includes(initialHash)) {
      this.activeSectionId.set(initialHash);
    }
  }

  setActive(id: string): void {
    if (this.observedIds.includes(id)) {
      this.activeSectionId.set(id);
    }
  }

  private cleanup(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    if (this.scrollListener && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = undefined;
    }
    if (this.hashListener && typeof window !== 'undefined') {
      window.removeEventListener('hashchange', this.hashListener);
      this.hashListener = undefined;
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}

