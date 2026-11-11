import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AssistantService {
  private platformId = inject(PLATFORM_ID);

  readonly isOpen = signal<boolean>(false);
  readonly isScrolledPastHero = signal<boolean>(false);

  private heroLauncherEl: HTMLElement | null = null;
  private avatarLauncherEl: HTMLElement | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      const checkScroll = () => {
        const heroEl = document.getElementById('home');
        const heroHeight = heroEl ? heroEl.offsetHeight : 800;
        const past = window.scrollY > heroHeight * 0.6;
        if (this.isScrolledPastHero() !== past) {
          this.isScrolledPastHero.set(past);
        }
      };

      window.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll, { passive: true });
      // Run once after DOM settles
      setTimeout(checkScroll, 100);
    }
  }

  registerHeroLauncher(el: HTMLElement): void {
    this.heroLauncherEl = el;
  }

  registerAvatarLauncher(el: HTMLElement): void {
    this.avatarLauncherEl = el;
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.returnFocusToLauncher();
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  returnFocusToLauncher(): void {
    setTimeout(() => {
      if (this.isScrolledPastHero() && this.avatarLauncherEl) {
        this.avatarLauncherEl.focus();
      } else if (this.heroLauncherEl) {
        this.heroLauncherEl.focus();
      }
    }, 50);
  }
}
