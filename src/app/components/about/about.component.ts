import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profile, skills } from '../../core/portfolio.data';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  profile = profile;
  skillCategories = Object.entries(skills).map(([category, items]) => ({
    category,
    items,
  }));
}

