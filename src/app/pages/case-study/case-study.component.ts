import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { caseStudies, CaseStudy } from '../../core/portfolio.data';
import { SeoService } from '../../core/seo.service';
import { ArchExplorerComponent } from '../../components/arch-explorer/arch-explorer.component';

@Component({
  selector: 'app-case-study',
  standalone: true,
  imports: [CommonModule, RouterModule, ArchExplorerComponent],
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss'],
})
export class CaseStudyComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);

  study = signal<CaseStudy | undefined>(undefined);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      const found = caseStudies.find((s) => s.slug === slug);
      this.study.set(found);

      if (found) {
        this.seoService.updateSeo({
          title: found.title,
          description: found.problem,
          url: `/case-studies/${found.slug}`,
        });
      }
    });
  }

  isTodo(text: string): boolean {
    return typeof text === 'string' && text.startsWith('TODO(');
  }

  cleanTodoText(text: string): string {
    return text.replace(/^TODO\([^)]+\):\s*/, '');
  }
}
