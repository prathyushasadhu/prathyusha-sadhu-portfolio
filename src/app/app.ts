import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { MiniMeComponent } from './components/mini-me/mini-me.component';
import { CommandPaletteService } from './core/command-palette.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavComponent,
    CommandPaletteComponent,
    MiniMeComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  paletteService = inject(CommandPaletteService);

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.paletteService.toggle();
    } else if (event.key === 'Escape' && this.paletteService.isOpen()) {
      this.paletteService.close();
    }
  }
}
