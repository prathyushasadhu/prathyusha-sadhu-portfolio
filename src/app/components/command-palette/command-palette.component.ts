import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { caseStudies, projectCards } from '../../core/portfolio.data';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Case Studies' | 'Projects' | 'Links';
  target: string; // anchor or route
  isRoute?: boolean;
  isExternal?: boolean;
  hint?: string;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.scss'],
})
export class CommandPaletteComponent implements OnChanges {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  searchQuery = signal<string>('');
  selectedIndex = signal<number>(0);

  readonly allCommands: CommandItem[] = [
    // Navigation
    { id: 'nav-home', title: 'Home', category: 'Navigation', target: '#home', hint: 'Go to top' },
    { id: 'nav-about', title: 'About', category: 'Navigation', target: '#about', hint: 'Overview & skills' },
    { id: 'nav-eng', title: 'Engineering Lab', category: 'Navigation', target: '#eng', hint: 'Enterprise case studies' },
    { id: 'nav-ai', title: 'AI Lab', category: 'Navigation', target: '#ai', hint: 'Voice & agentic AI' },
    { id: 'nav-product', title: 'Product Studio', category: 'Navigation', target: '#product', hint: 'Prototypes & products' },
    { id: 'nav-resume', title: 'Career & Resume', category: 'Navigation', target: '#resume', hint: 'Experience & credentials' },
    { id: 'nav-contact', title: 'Contact Me', category: 'Navigation', target: '#contact', hint: 'Email & LinkedIn' },

    // Case Studies
    ...caseStudies.map((cs) => ({
      id: `cs-${cs.slug}`,
      title: cs.title,
      category: 'Case Studies' as const,
      target: `/case-studies/${cs.slug}`,
      isRoute: true,
      hint: cs.lab === 'engineering' ? 'Engineering Lab' : 'AI Lab',
    })),

    // Projects
    ...projectCards.map((p) => ({
      id: `pj-${p.id}`,
      title: p.title,
      category: 'Projects' as const,
      target: `#${p.id}`,
      hint: p.subtitle,
    })),

    // External / Direct Links
    {
      id: 'ext-stock',
      title: 'Stock Analyzer GitHub Repository',
      category: 'Links',
      target: 'https://github.com/prathyushasadhu/stock-analyzer',
      isExternal: true,
      hint: 'Open in new tab',
    },
    {
      id: 'ext-resume-pdf',
      title: 'Download Resume (PDF)',
      category: 'Links',
      target: '/assets/Prathyusha_Sadhu_Resume.pdf',
      isExternal: true,
      hint: 'Download',
    },
  ];

  filteredCommands = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.allCommands;
    return this.allCommands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.hint && c.hint.toLowerCase().includes(q))
    );
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.searchQuery.set('');
      this.selectedIndex.set(0);
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
      }
    }
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.selectedIndex.set(0);
  }

  onKeyDown(event: KeyboardEvent): void {
    const list = this.filteredCommands();
    if (!list.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex.update((i) => (i + 1) % list.length);
      this.scrollActiveIntoView();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex.update((i) => (i - 1 + list.length) % list.length);
      this.scrollActiveIntoView();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = list[this.selectedIndex()];
      if (selected) {
        this.executeCommand(selected);
      }
    } else if (event.key === 'Escape') {
      this.dismiss();
    }
  }

  executeCommand(cmd: CommandItem): void {
    this.dismiss();

    if (cmd.isExternal) {
      if (isPlatformBrowser(this.platformId)) {
        window.open(cmd.target, '_blank', 'noopener');
      }
      return;
    }

    if (cmd.isRoute) {
      this.router.navigateByUrl(cmd.target);
      return;
    }

    // Anchor navigation
    if (this.router.url !== '/' && !this.router.url.startsWith('/#')) {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToAnchor(cmd.target), 100);
      });
    } else {
      this.scrollToAnchor(cmd.target);
    }
  }

  private scrollToAnchor(anchor: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const targetId = anchor.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus({ preventScroll: true });
      el.classList.add('highlight-flash');
      setTimeout(() => el.classList.remove('highlight-flash'), 1500);
    }
  }

  private scrollActiveIntoView(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      const activeEl = document.querySelector('.palette-item.selected');
      activeEl?.scrollIntoView({ block: 'nearest' });
    }, 10);
  }

  dismiss(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('palette-backdrop')) {
      this.dismiss();
    }
  }
}

