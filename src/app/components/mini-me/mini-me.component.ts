import {
  Component,
  signal,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  HostListener,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { demoReply } from '../../core/assistant';
import { AssistantService } from '../../core/assistant.service';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
}

@Component({
  selector: 'app-mini-me',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mini-me.component.html',
  styleUrls: ['./mini-me.component.scss'],
})
export class MiniMeComponent implements AfterViewInit, AfterViewChecked {
  private http = inject(HttpClient);
  private assistantService = inject(AssistantService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('messagesScroll') private messagesScroll?: ElementRef<HTMLDivElement>;
  @ViewChild('avatarLauncherRef') private avatarLauncherRef?: ElementRef<HTMLButtonElement>;

  isOpen = this.assistantService.isOpen;
  isScrolledPastHero = this.assistantService.isScrolledPastHero;
  isThinking = signal<boolean>(false);
  inputText = signal<string>('');

  messages = signal<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hi! I'm Orbi, Prathyusha's AI Twin. Ask me anything about her enterprise Angular background, performance metrics, or AI projects. I answer strictly from her verified portfolio.",
      time: 'Just now',
    },
  ]);

  readonly suggestions = [
    'Angular experience',
    'Performance metrics',
    'AI projects',
    'Why a Senior role?',
  ];

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.closeChat();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.avatarLauncherRef?.nativeElement) {
      this.assistantService.registerAvatarLauncher(this.avatarLauncherRef.nativeElement);
    }
  }

  toggleChat(): void {
    this.assistantService.toggle();
  }

  closeChat(): void {
    this.assistantService.close();
  }

  askSuggestion(prompt: string): void {
    this.sendQuestion(prompt);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const query = this.inputText().trim();
    if (!query) return;
    this.sendQuestion(query);
    this.inputText.set('');
  }

  private sendQuestion(question: string): void {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: question,
      time: 'Just now',
    };

    this.messages.update((msgs) => [...msgs, userMsg]);
    this.isThinking.set(true);

    this.http.post<{ demo?: boolean; answer?: string }>('/api/assistant', { question }).subscribe({
      next: (res) => {
        const replyText = res.demo || !res.answer ? demoReply(question) : res.answer;
        this.deliverReply(replyText);
      },
      error: () => {
        const fallback = demoReply(question);
        this.deliverReply(fallback);
      },
    });
  }

  private deliverReply(text: string): void {
    setTimeout(() => {
      this.isThinking.set(false);
      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text,
        time: 'Just now',
      };
      this.messages.update((msgs) => [...msgs, botMsg]);
    }, 500);
  }

  ngAfterViewChecked(): void {
    if (this.isOpen() && this.messagesScroll) {
      const el = this.messagesScroll.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
