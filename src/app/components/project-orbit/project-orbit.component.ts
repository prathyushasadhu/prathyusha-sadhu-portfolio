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
  NgZone,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface PlanetDef {
  id: string;
  name: string;
  orbitLabel: string;
  cardId: string;
  kind: 'pro' | 'ind';
  icon:
    | 'code'
    | 'gauge'
    | 'shield-check'
    | 'image'
    | 'heart-pulse'
    | 'message-square'
    | 'cpu'
    | 'mic'
    | 'bar-chart'
    | 'graduation-cap';
  accent: string;
  ringIndex: number;
  thetaOffset: number;
  x: number;
  y: number;
  zIndex?: number;
  isHovered?: boolean;
  labelHidden?: boolean;
}

export interface RingDef {
  index: number;
  name: string;
  rx: number;
  ry: number;
  tilt: number;
  speed: number;
  angle: number;
  paused: boolean;
  color: string;
}

export interface OrbitGeometry {
  width: number;
  height: number;
  cx: number;
  cy: number;
  tiltDeg: number;
  phiDeg: number;
  phiRad: number;
  cosPhi: number;
  sinPhi: number;
  coreDiameter: number;
  rings: {
    index: number;
    rx: number;
    ry: number;
    tilt: number;
  }[];
}

export function computeOrbitGeometry(width: number, height: number): OrbitGeometry {
  const cx = width / 2;
  const cy = height / 2;
  const tiltDeg = 65;
  const phiDeg = -12;
  const phiRad = (phiDeg * Math.PI) / 180;
  const cosPhi = Math.cos(phiRad);
  const sinPhi = Math.sin(phiRad);
  const minorRatio = 0.42;

  // baseW is width / 1.10 to guarantee outer ring planet centers stay strictly within [0.02*w, 0.98*w]
  const baseW = width / 1.10;

  const rx0 = +(baseW * 0.30).toFixed(2);
  const rx1 = +(baseW * 0.42).toFixed(2);
  const rx2 = +(baseW * 0.54).toFixed(2);

  const coreDiameter = Math.round(width * 0.18);

  return {
    width,
    height,
    cx,
    cy,
    tiltDeg,
    phiDeg,
    phiRad,
    cosPhi,
    sinPhi,
    coreDiameter,
    rings: [
      { index: 0, rx: rx0, ry: +(rx0 * minorRatio).toFixed(2), tilt: tiltDeg },
      { index: 1, rx: rx1, ry: +(rx1 * minorRatio).toFixed(2), tilt: tiltDeg },
      { index: 2, rx: rx2, ry: +(rx2 * minorRatio).toFixed(2), tilt: tiltDeg },
    ],
  };
}

@Component({
  selector: 'app-project-orbit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-orbit.component.html',
  styleUrls: ['./project-orbit.component.scss'],
})
export class ProjectOrbitComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stageRef') stageRef?: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  // Dynamic geometry dimensions
  stageWidth = 640;
  stageHeight = 512;
  cx = 320;
  cy = 256;
  tiltDeg = 65;
  phiDeg = -12;
  phiRad = (-12 * Math.PI) / 180;
  cosPhi = Math.cos((-12 * Math.PI) / 180);
  sinPhi = Math.sin((-12 * Math.PI) / 180);
  coreDiameter = 115;

  // Interactive tips
  tipTitle = signal<string>('');
  tipSubtitle = signal<string>('');
  isTipActive = signal<boolean>(false);
  hoveredRingIndex = signal<number | null>(null);

  rings: RingDef[] = [
    { index: 0, name: 'Product Studio', rx: 174, ry: 73, tilt: 65, speed: (2 * Math.PI) / 38, angle: 0, paused: false, color: '#3B82F6' },
    { index: 1, name: 'AI Lab', rx: 244, ry: 102, tilt: 65, speed: -(2 * Math.PI) / 54, angle: 1.2, paused: false, color: '#8B5CF6' },
    { index: 2, name: 'Engineering Lab', rx: 314, ry: 132, tilt: 65, speed: (2 * Math.PI) / 72, angle: 2.4, paused: false, color: '#22D3EE' },
  ];

  planets: PlanetDef[] = [
    // Ring 0: Product (2 items, separated by PI)
    { id: 'pj-prod-jarvis', name: 'Jarvis: AI personal assistant', orbitLabel: 'Jarvis', cardId: 'pj-prod-jarvis', kind: 'ind', icon: 'mic', accent: '#3B82F6', ringIndex: 0, thetaOffset: 0, x: 0, y: 0, zIndex: 20 },
    { id: 'pj-prod-stock', name: 'Stock Analyzer', orbitLabel: 'Stock Analyzer', cardId: 'pj-prod-stock', kind: 'ind', icon: 'bar-chart', accent: '#F59E0B', ringIndex: 0, thetaOffset: Math.PI, x: 0, y: 0, zIndex: 20 },

    // Ring 1: AI (3 items, separated by 2*PI/3)
    { id: 'pj-ai-qlive', name: 'q-live: voice AI for clinic booking', orbitLabel: 'q-live', cardId: 'pj-ai-qlive', kind: 'ind', icon: 'heart-pulse', accent: '#F472B6', ringIndex: 1, thetaOffset: Math.PI / 6, x: 0, y: 0, zIndex: 20 },
    { id: 'pj-ai-chat', name: 'Multi-model AI chat platform', orbitLabel: 'AI Chat', cardId: 'pj-ai-chat', kind: 'ind', icon: 'message-square', accent: '#A855F7', ringIndex: 1, thetaOffset: Math.PI / 6 + (2 * Math.PI) / 3, x: 0, y: 0, zIndex: 20 },
    { id: 'pj-ai-perf', name: 'AI performance optimization engine', orbitLabel: 'Perf Engine', cardId: 'pj-ai-perf', kind: 'ind', icon: 'cpu', accent: '#8B5CF6', ringIndex: 1, thetaOffset: Math.PI / 6 + (4 * Math.PI) / 3, x: 0, y: 0, zIndex: 20 },

    // Ring 2: Engineering & Journey (5 items, separated by 2*PI/5)
    { id: 'pj-eng-arch', name: 'Angular architecture and reusable UI', orbitLabel: 'Angular Architecture', cardId: 'pj-eng-arch', kind: 'pro', icon: 'code', accent: '#22D3EE', ringIndex: 2, thetaOffset: 0, x: 0, y: 0, zIndex: 20 },
    { id: 'pj-eng-cwv', name: 'Core Web Vitals and performance', orbitLabel: 'Web Performance', cardId: 'pj-eng-cwv', kind: 'pro', icon: 'gauge', accent: '#34D399', ringIndex: 2, thetaOffset: (2 * Math.PI) / 5, x: 0, y: 0, zIndex: 20 },
    { id: 'pj-eng-pay', name: 'Payment integration debugging', orbitLabel: 'Payments', cardId: 'pj-eng-pay', kind: 'pro', icon: 'shield-check', accent: '#2DD4BF', ringIndex: 2, thetaOffset: (4 * Math.PI) / 5, x: 0, y: 0, zIndex: 20 },
    { id: 'pj-eng-aem', name: 'AEM image optimization', orbitLabel: 'AEM Images', cardId: 'pj-eng-aem', kind: 'pro', icon: 'image', accent: '#F59E0B', ringIndex: 2, thetaOffset: (6 * Math.PI) / 5, x: 0, y: 0, zIndex: 20 },
    { id: 'pj-journey-edu', name: 'Education and certifications', orbitLabel: 'Education', cardId: 'journey', kind: 'pro', icon: 'graduation-cap', accent: '#3B82F6', ringIndex: 2, thetaOffset: (8 * Math.PI) / 5, x: 0, y: 0, zIndex: 20 },
  ];

  // Priority mapping for label collision avoidance
  private readonly priorityOrder: Record<string, number> = {
    'pj-eng-arch': 100, // Angular Architecture first
    'pj-ai-qlive': 90,  // q-live first
    'pj-prod-jarvis': 80, // Jarvis first
    'pj-prod-stock': 70, // Stock Analyzer first
    'pj-ai-chat': 60,
    'pj-ai-perf': 50,
    'pj-eng-cwv': 40,
    'pj-eng-pay': 30,
    'pj-eng-aem': 20,
    'pj-journey-edu': 10,
  };

  particles: { cx: number; cy: number; r: number; opacity: number; color: string }[] = [];

  private planetEls = new Map<string, HTMLElement>();
  private animFrameId: number | null = null;
  private collisionTimer: any = null;
  private lastTime = 0;
  private isBrowser = false;
  private isReducedMotion = false;
  private isVisible = true;
  private isIntersecting = false;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private visibilityHandler?: () => void;

  constructor() {
    this.applyGeometry(computeOrbitGeometry(620, 440));
    this.calculateStaticPositions();
    this.generateParticles();
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser || typeof window === 'undefined') return;

    this.isReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.visibilityHandler = () => {
      this.isVisible = !document.hidden;
      if (this.isVisible && this.isIntersecting && !this.animFrameId && !this.isReducedMotion) {
        this.startAnimation();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          this.isIntersecting = entries[0]?.isIntersecting ?? false;
          if (this.isIntersecting && this.isVisible && !this.animFrameId && !this.isReducedMotion) {
            this.startAnimation();
          } else if (!this.isIntersecting && this.animFrameId) {
            this.stopAnimation();
          }
        },
        { threshold: 0.05 }
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.stageRef?.nativeElement) {
      for (const p of this.planets) {
        const el = document.getElementById('planet-' + p.id);
        if (el) {
          this.planetEls.set(p.id, el);
        }
      }

      // Initial measurement & ResizeObserver
      const rect = this.stageRef.nativeElement.getBoundingClientRect();
      if (rect.width > 50 && rect.height > 50) {
        this.onStageResize(rect.width, rect.height);
      }

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const cr = entry.contentRect;
            if (cr.width > 50 && cr.height > 50) {
              this.onStageResize(cr.width, cr.height);
            }
          }
        });
        this.resizeObserver.observe(this.stageRef.nativeElement);
      }

      if (!this.isReducedMotion) {
        this.isIntersecting = true;
        this.startAnimation();
      }
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(this.stageRef.nativeElement);
      }

      // Collision avoidance timer every 250ms
      this.ngZone.runOutsideAngular(() => {
        this.collisionTimer = setInterval(() => {
          this.checkLabelCollisions();
        }, 250);
      });
    }
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    if (this.collisionTimer) {
      clearInterval(this.collisionTimer);
      this.collisionTimer = null;
    }
    if (this.visibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  private onStageResize(width: number, height: number): void {
    const geom = computeOrbitGeometry(Math.round(width), Math.round(height));
    this.applyGeometry(geom);
    this.calculateStaticPositions();
    this.updateDomPositions();
    this.generateParticles();
    this.checkLabelCollisions();
  }

  private applyGeometry(geom: OrbitGeometry): void {
    this.stageWidth = geom.width;
    this.stageHeight = geom.height;
    this.cx = geom.cx;
    this.cy = geom.cy;
    this.tiltDeg = geom.tiltDeg;
    this.phiDeg = geom.phiDeg;
    this.phiRad = geom.phiRad;
    this.cosPhi = geom.cosPhi;
    this.sinPhi = geom.sinPhi;
    this.coreDiameter = geom.coreDiameter;

    for (let i = 0; i < this.rings.length; i++) {
      const gRing = geom.rings[i];
      if (gRing) {
        this.rings[i].rx = gRing.rx;
        this.rings[i].ry = gRing.ry;
        this.rings[i].tilt = gRing.tilt;
      }
    }
  }

  private calculateStaticPositions(): void {
    for (const p of this.planets) {
      const ring = this.rings[p.ringIndex];
      const theta = ring.angle + p.thetaOffset;
      const x0 = ring.rx * Math.cos(theta);
      const y0 = ring.ry * Math.sin(theta);
      p.x = +(this.cx + x0 * this.cosPhi - y0 * this.sinPhi).toFixed(2);
      p.y = +(this.cy + x0 * this.sinPhi + y0 * this.cosPhi).toFixed(2);
      const isFront = Math.sin(theta) > 0;
      p.zIndex = p.isHovered ? 50 : (isFront ? 30 : 10);
    }
  }

  private updateDomPositions(): void {
    for (const p of this.planets) {
      const el = this.planetEls.get(p.id) || document.getElementById('planet-' + p.id);
      if (el) {
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        el.style.zIndex = `${p.zIndex || 20}`;
      }

      // Clamp label inside stage bounds
      const labelEl = document.getElementById('label-' + p.id);
      if (labelEl) {
        const labelW = labelEl.offsetWidth || 72;
        const labelH = labelEl.offsetHeight || 22;
        let offsetX = -labelW / 2;
        const absLeft = p.x + offsetX;
        if (absLeft < 6) {
          offsetX = 6 - p.x;
        } else if (absLeft + labelW > this.stageWidth - 6) {
          offsetX = (this.stageWidth - 6) - p.x - labelW;
        }

        let offsetY = 28;
        if (p.y + offsetY + labelH > this.stageHeight - 6) {
          offsetY = -28 - labelH;
        }

        labelEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    }
  }

  private generateParticles(): void {
    const pts: { cx: number; cy: number; r: number; opacity: number; color: string }[] = [];
    this.rings.forEach((ring) => {
      const count = ring.index === 0 ? 12 : ring.index === 1 ? 18 : 24;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 + 0.15;
        const x0 = ring.rx * Math.cos(theta);
        const y0 = ring.ry * Math.sin(theta);
        const cx = +(this.cx + x0 * this.cosPhi - y0 * this.sinPhi).toFixed(2);
        const cy = +(this.cy + x0 * this.sinPhi + y0 * this.cosPhi).toFixed(2);
        pts.push({
          cx,
          cy,
          r: +(0.8 + (i % 3) * 0.4).toFixed(1),
          opacity: +(0.2 + ((i * 7) % 5) * 0.08).toFixed(2),
          color: ring.color,
        });
      }
    });
    this.particles = pts;
  }

  private startAnimation(): void {
    if (this.animFrameId !== null || this.isReducedMotion || !this.isBrowser) return;
    this.lastTime = performance.now();

    this.ngZone.runOutsideAngular(() => {
      const loop = (now: number) => {
        if (!this.isVisible || !this.isIntersecting) {
          this.animFrameId = null;
          return;
        }

        const dt = Math.min((now - this.lastTime) / 1000, 0.1);
        this.lastTime = now;

        // Update ring angles if not paused (pauses ONLY its own ring on hover)
        for (const ring of this.rings) {
          if (!ring.paused) {
            ring.angle += ring.speed * dt;
          }
        }

        // Update planet positions using the exact geometry values
        for (const p of this.planets) {
          const ring = this.rings[p.ringIndex];
          const theta = ring.angle + p.thetaOffset;
          const x0 = ring.rx * Math.cos(theta);
          const y0 = ring.ry * Math.sin(theta);
          p.x = +(this.cx + x0 * this.cosPhi - y0 * this.sinPhi).toFixed(2);
          p.y = +(this.cy + x0 * this.sinPhi + y0 * this.cosPhi).toFixed(2);
          const isFront = Math.sin(theta) > 0;
          p.zIndex = p.isHovered ? 50 : (isFront ? 30 : 10);

          const el = this.planetEls.get(p.id) || document.getElementById('planet-' + p.id);
          if (el) {
            el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            el.style.zIndex = `${p.zIndex}`;
          }

          const labelEl = document.getElementById('label-' + p.id);
          if (labelEl) {
            const labelW = labelEl.offsetWidth || 72;
            const labelH = labelEl.offsetHeight || 22;
            let offsetX = -labelW / 2;
            const absLeft = p.x + offsetX;
            if (absLeft < 6) {
              offsetX = 6 - p.x;
            } else if (absLeft + labelW > this.stageWidth - 6) {
              offsetX = (this.stageWidth - 6) - p.x - labelW;
            }

            let offsetY = 28;
            if (p.y + offsetY + labelH > this.stageHeight - 6) {
              offsetY = -28 - labelH;
            }

            labelEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          }
        }

        this.animFrameId = requestAnimationFrame(loop);
      };

      this.animFrameId = requestAnimationFrame(loop);
    });
  }

  private stopAnimation(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  // Collision Avoidance: Check every 250ms and hide overlapping lower-priority labels
  private checkLabelCollisions(): void {
    if (!this.isBrowser) return;

    // Get character launcher bounding rect to avoid overlapping it
    const charEl = document.querySelector('.hero-character-launcher');
    const charRect = charEl ? charEl.getBoundingClientRect() : null;

    const sorted = [...this.planets].sort((a, b) => {
      if (a.isHovered && !b.isHovered) return -1;
      if (!a.isHovered && b.isHovered) return 1;
      return (this.priorityOrder[b.id] ?? 0) - (this.priorityOrder[a.id] ?? 0);
    });

    const acceptedRects: DOMRect[] = [];

    for (const p of sorted) {
      const labelEl = document.getElementById('label-' + p.id);
      if (!labelEl) continue;

      if (p.isHovered) {
        p.labelHidden = false;
        labelEl.classList.remove('label-hidden');
        acceptedRects.push(labelEl.getBoundingClientRect());
        continue;
      }

      const rect = labelEl.getBoundingClientRect();

      // Check collision with character launcher
      if (charRect) {
        const touchesChar = !(
          rect.right < charRect.left ||
          rect.left > charRect.right ||
          rect.bottom < charRect.top ||
          rect.top > charRect.bottom
        );
        if (touchesChar) {
          p.labelHidden = true;
          labelEl.classList.add('label-hidden');
          continue;
        }
      }

      let overlaps = false;
      const margin = 4; // 4px margin between labels

      for (const ar of acceptedRects) {
        if (
          rect.left < ar.right + margin &&
          rect.right > ar.left - margin &&
          rect.top < ar.bottom + margin &&
          rect.bottom > ar.top - margin
        ) {
          overlaps = true;
          break;
        }
      }

      if (overlaps) {
        p.labelHidden = true;
        labelEl.classList.add('label-hidden');
      } else {
        p.labelHidden = false;
        labelEl.classList.remove('label-hidden');
        acceptedRects.push(rect);
      }
    }
  }

  onPlanetHover(planet: PlanetDef): void {
    // Pauses ONLY its own ring
    this.rings[planet.ringIndex].paused = true;
    planet.isHovered = true;
    this.hoveredRingIndex.set(planet.ringIndex);
    this.tipTitle.set(planet.name);
    this.tipSubtitle.set(
      `${planet.kind === 'ind' ? 'Independent Project' : 'Enterprise Engineering'} · Ring: ${this.rings[planet.ringIndex].name}`
    );
    this.isTipActive.set(true);
    this.checkLabelCollisions();
  }

  onPlanetLeave(planet: PlanetDef): void {
    // Unhovering resumes ring from current angle without snap
    this.rings[planet.ringIndex].paused = false;
    planet.isHovered = false;
    this.hoveredRingIndex.set(null);
    this.isTipActive.set(false);
    this.checkLabelCollisions();
  }

  onCoreHover(): void {
    this.tipTitle.set('Prathyusha Sadhu');
    this.tipSubtitle.set('Senior Frontend Engineer · AI Product Builder');
    this.isTipActive.set(true);
  }

  onCoreLeave(): void {
    this.isTipActive.set(false);
  }

  onCoreClick(event: Event): void {
    event.preventDefault();
    if (!this.isBrowser) return;
    const target = document.getElementById('project-orbit') || document.getElementById('journey');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      target.focus({ preventScroll: true });
    }
  }

  scrollToTarget(cardId: string, event: Event): void {
    event.preventDefault();
    if (!this.isBrowser) return;
    const el = document.getElementById(cardId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus({ preventScroll: true });
      el.classList.add('highlight-flash');
      setTimeout(() => el.classList.remove('highlight-flash'), 1600);
    }
  }
}
