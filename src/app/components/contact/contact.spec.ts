import { describe, it, beforeEach, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';

describe('ContactComponent (No Form)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();
  });

  it('should render the contact section with direct links and NO form or input elements', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Must NOT contain form, input, or textarea
    expect(compiled.querySelector('form')).toBeNull();
    expect(compiled.querySelector('input')).toBeNull();
    expect(compiled.querySelector('textarea')).toBeNull();

    // Must contain heading, email link, Email me button, copy button, and social links
    expect(compiled.querySelector('h2#contact-title')).toBeTruthy();
    expect(compiled.querySelector('a.email-btn')).toBeTruthy();
    expect(compiled.querySelector('button.copy-btn')).toBeTruthy();

    const directLinks = compiled.querySelectorAll('.direct-item');
    expect(directLinks.length).toBe(3);

    const emailLink = compiled.querySelector('a[href^="mailto:prathyushasadhu12@gmail.com"]');
    expect(emailLink).toBeTruthy();

    const linkedinLink = compiled.querySelector('a[href*="linkedin.com"]');
    expect(linkedinLink).toBeTruthy();

    const githubLink = compiled.querySelector('a[href*="github.com"]');
    expect(githubLink).toBeTruthy();
  });
});

