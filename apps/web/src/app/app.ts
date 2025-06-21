import { Component, inject } from '@angular/core';
import { ChatService } from './services/chat.service';
import { PersonalitySelectionComponent } from './components/personality-selection.component';
import { ChatComponent } from './components/chat.component';
import { AsyncPipe } from '@angular/common';
import { ChatSidebarComponent } from './components/chat-sidebar.component';

@Component({
  imports: [AsyncPipe, ChatComponent, ChatSidebarComponent, PersonalitySelectionComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly chatService = inject(ChatService);
  currentPersonality$ = this.chatService.currentPersonality$
}
