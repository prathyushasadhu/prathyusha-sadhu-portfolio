import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  updateSeo(config: SeoConfig): void {
    const siteUrl = 'https://prathyusha.dev';
    const isHome = !config.url || config.url === '/' || config.title === 'Prathyusha Sadhu' || !config.title;
    const title = isHome ? 'Prathyusha Sadhu' : `${config.title} | Prathyusha Sadhu`;
    const url = config.url ? `${siteUrl}${config.url}` : siteUrl;
    const image = config.image ? `${siteUrl}${config.image}` : `${siteUrl}/assets/profile/avatar-480.webp`;
    const description =
      config.description ||
      'Senior Frontend Engineer with 9+ years building enterprise Angular applications and exploring AI product interfaces.';

    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:type', content: config.type || 'website' });

    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    // Canonical link tag
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
