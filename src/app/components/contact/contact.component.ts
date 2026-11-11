import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { profile } from '../../core/portfolio.data';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  private platformId = inject(PLATFORM_ID);

  profile = profile;
  copied = signal<boolean>(false);

  copyEmail(): void {
    if (!isPlatformBrowser(this.platformId) || !navigator.clipboard) return;
    navigator.clipboard.writeText(this.profile.email).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    });
  }
}
