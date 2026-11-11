import { Component, Input, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectCard } from '../../core/portfolio.data';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  @Input({ required: true }) card!: ProjectCard;

  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  onMouseMove(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const cardEl = this.el.nativeElement.querySelector('.card') as HTMLElement;
    if (cardEl) {
      cardEl.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(6px)`;
      cardEl.style.setProperty('--glare-x', `${event.clientX - rect.left}px`);
      cardEl.style.setProperty('--glare-y', `${event.clientY - rect.top}px`);
    }
  }

  onMouseLeave(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const cardEl = this.el.nativeElement.querySelector('.card') as HTMLElement;
    if (cardEl) {
      cardEl.style.transform = '';
      cardEl.style.removeProperty('--glare-x');
      cardEl.style.removeProperty('--glare-y');
    }
  }
}

