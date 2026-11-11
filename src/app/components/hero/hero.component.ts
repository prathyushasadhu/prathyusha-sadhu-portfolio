import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  signal,
  inject,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProjectOrbitComponent } from '../project-orbit/project-orbit.component';
import { AssistantService } from '../../core/assistant.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ProjectOrbitComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroLauncherRef') heroLauncherRef?: ElementRef<HTMLElement>;

  private assistantService = inject(AssistantService);
  private platformId = inject(PLATFORM_ID);

  isScrolledPastHero = this.assistantService.isScrolledPastHero;
  bubbleCollapsed = signal<boolean>(false);
  greetingVisible = signal<boolean>(false);

  private collapseTimeout: any = null;
  private scrollHandler?: () => void;
  private isBrowser = false;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser || typeof window === 'undefined') {
      this.greetingVisible.set(true);
      return;
    }

    // Reveal greeting bubble after brief delay
    setTimeout(() => {
      this.greetingVisible.set(true);
    }, 600);

    // Auto-collapse after 8 seconds
    this.collapseTimeout = setTimeout(() => {
      this.bubbleCollapsed.set(true);
    }, 8000);

    // Collapse on scroll
    this.scrollHandler = () => {
      if (window.scrollY > 20 && !this.bubbleCollapsed()) {
        this.bubbleCollapsed.set(true);
      }
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.heroLauncherRef?.nativeElement) {
      this.assistantService.registerHeroLauncher(this.heroLauncherRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.collapseTimeout) {
      clearTimeout(this.collapseTimeout);
    }
    if (this.scrollHandler && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  onCharacterClick(event: MouseEvent): void {
    // If clicking directly on a link or button inside the bubble, let that handle it
    const target = event.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    this.openAssistantDialog();
  }

  openAssistantDialog(): void {
    this.assistantService.open();
  }

  collapseBubble(event: Event): void {
    event.stopPropagation();
    this.bubbleCollapsed.set(true);
  }

  expandBubble(event: Event): void {
    event.stopPropagation();
    this.bubbleCollapsed.set(false);
  }
}
