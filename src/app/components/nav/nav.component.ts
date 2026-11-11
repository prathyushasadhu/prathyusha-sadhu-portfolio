import {
  Component,
  Output,
  EventEmitter,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveSectionService } from '../../core/active-section.service';

interface NavItem {
  label: string;
  href: string;
  id: string;
  icon: 'home' | 'orbit' | 'journey' | 'ai' | 'skills' | 'contact';
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  @Output() openCommandPalette = new EventEmitter<void>();

  private activeSectionService = inject(ActiveSectionService);

  menuOpen = signal(false);
  activeSection = this.activeSectionService.activeSectionId;

  readonly navItems: NavItem[] = [
    { label: 'Home', href: '#home', id: 'home', icon: 'home' },
    { label: 'Project Orbit', href: '#project-orbit', id: 'project-orbit', icon: 'orbit' },
    { label: 'My Journey', href: '#journey', id: 'journey', icon: 'journey' },
    { label: 'AI Lab', href: '#ai-lab', id: 'ai-lab', icon: 'ai' },
    { label: 'Skills', href: '#skills', id: 'skills', icon: 'skills' },
    { label: 'Contact', href: '#contact', id: 'contact', icon: 'contact' },
  ];

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onLogoClick(event: Event): void {
    this.activeSectionService.setActive('home');
    this.closeMenu();
  }

  onItemClick(id: string): void {
    this.activeSectionService.setActive(id);
    this.closeMenu();
  }

  triggerCommandPalette(): void {
    this.openCommandPalette.emit();
  }
}
