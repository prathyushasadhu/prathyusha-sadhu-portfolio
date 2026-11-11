import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { verifiedStats } from '../../core/portfolio.data';

@Component({
  selector: 'app-stats-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-strip.component.html',
  styleUrls: ['./stats-strip.component.scss'],
})
export class StatsStripComponent implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  stats = [
    { value: '9+', label: verifiedStats[0].label, target: 9, suffix: '+' },
    { value: 'v8–19', label: verifiedStats[1].label, target: null },
    { value: '3 yrs', label: verifiedStats[2].label, target: 3, suffix: ' yrs' },
    { value: '2', label: verifiedStats[3].label, target: 2 },
    { value: '90+', label: verifiedStats[4].label, target: 90, suffix: '+' },
  ];

  private hasAnimated = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      if (typeof IntersectionObserver === 'undefined') {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.hasAnimated) {
              this.hasAnimated = true;
              this.animateCountersDirectly();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(this.el.nativeElement);
    }
  }

  // Pure DOM mutation for 0ms Angular change detection overhead / 0ms TBT
  private animateCountersDirectly(): void {
    const valEls = this.el.nativeElement.querySelectorAll('.stat-val') as NodeListOf<HTMLElement>;
    if (!valEls || valEls.length === 0) return;

    const duration = 1000;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      this.stats.forEach((stat, idx) => {
        if (stat.target !== null && valEls[idx]) {
          const current = Math.round(stat.target * ease);
          valEls[idx].textContent = `${current}${stat.suffix || ''}`;
        }
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.stats.forEach((stat, idx) => {
          if (valEls[idx]) {
            valEls[idx].textContent = stat.value;
          }
        });
      }
    };

    requestAnimationFrame(step);
  }
}
