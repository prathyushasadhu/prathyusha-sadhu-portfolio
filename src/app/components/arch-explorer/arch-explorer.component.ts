import { Component, Input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchNode } from '../../core/portfolio.data';

@Component({
  selector: 'app-arch-explorer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arch-explorer.component.html',
  styleUrls: ['./arch-explorer.component.scss'],
})
export class ArchExplorerComponent implements OnInit {
  @Input({ required: true }) nodes: ArchNode[] = [];

  selectedNodeId = signal<string>('');

  ngOnInit(): void {
    if (this.nodes.length > 0) {
      this.selectedNodeId.set(this.nodes[0].id);
    }
  }

  selectNode(id: string): void {
    this.selectedNodeId.set(id);
  }

  get selectedNode(): ArchNode | undefined {
    return this.nodes.find((n) => n.id === this.selectedNodeId());
  }

  isTodo(text: string): boolean {
    return text.startsWith('TODO(');
  }

  cleanTodoText(text: string): string {
    return text.replace(/^TODO\([^)]+\):\s*/, '');
  }
}

