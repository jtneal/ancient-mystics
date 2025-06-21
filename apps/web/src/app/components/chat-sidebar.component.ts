import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatSession } from '../models/personality.model';
import { ChatService } from '../services/chat.service';
import { PersonalityService } from '../services/personality.service';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar-overlay" 
         [class.open]="sidebarOpen" 
         (click)="closeSidebar()">
    </div>
    
    <div class="sidebar" [class.open]="sidebarOpen">
      <div class="sidebar-header">
        <h2>Chat History</h2>
        <button class="close-button" (click)="closeSidebar()">
          <span>×</span>
        </button>
      </div>
      
      <div class="new-chat-section">
        <button class="new-chat-button" (click)="startNewChat()">
          <span class="plus-icon">+</span>
          New Chat
        </button>
      </div>
      
      <div class="chat-sessions">
        <div class="sessions-list">
          <div 
            *ngFor="let session of chatSessions; trackBy: trackBySessionId"
            class="session-item"
            [class.active]="currentSession?.id === session.id"
            (click)="loadSession(session.id)"
          >
            <div class="session-content">
              <div class="session-header">
                <img [src]="getPersonalityAvatar(session.personalityId)" 
                     [alt]="session.personalityName" 
                     class="session-avatar">
                <div class="session-info">
                  <div class="session-title">{{ session.title }}</div>
                  <div class="session-personality">{{ session.personalityName }}</div>
                </div>
              </div>
              <div class="session-meta">
                <span class="session-date">{{ formatDate(session.updatedAt) }}</span>
                <button class="delete-button" 
                        (click)="deleteSession($event, session.id)"
                        title="Delete chat">
                  <span>🗑️</span>
                </button>
              </div>
            </div>
          </div>
          
          <div *ngIf="chatSessions.length === 0" class="empty-state">
            <div class="empty-icon">💬</div>
            <p>No chat history yet</p>
            <p class="empty-subtitle">Start a conversation with a mystic guide</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 320px;
      height: 100vh;
      background: rgba(20, 20, 30, 0.95);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 999;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex;
      flex-direction: column;
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-header h2 {
      color: white;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
    }

    .close-button {
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      transition: all 0.3s ease;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .new-chat-section {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .new-chat-button {
      width: 100%;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 10px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .new-chat-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .plus-icon {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .chat-sessions {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
    }

    .sessions-list {
      padding: 0 1rem;
    }

    .session-item {
      margin-bottom: 0.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .session-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .session-item.active {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.4);
    }

    .session-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .session-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .session-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .session-info {
      flex: 1;
      min-width: 0;
    }

    .session-title {
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .session-personality {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.8rem;
      font-style: italic;
    }

    .session-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .session-date {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.7rem;
    }

    .delete-button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      opacity: 0;
    }

    .session-item:hover .delete-button {
      opacity: 1;
    }

    .delete-button:hover {
      background: rgba(255, 0, 0, 0.2);
      color: #ff6b6b;
      transform: scale(1.1);
    }

    .empty-state {
      text-align: center;
      padding: 2rem 1rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0.5rem 0;
    }

    .empty-subtitle {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    /* Scrollbar styling */
    .chat-sessions::-webkit-scrollbar {
      width: 4px;
    }

    .chat-sessions::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    .chat-sessions::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }

    .chat-sessions::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 280px;
      }
      
      .sidebar-header {
        padding: 1rem;
      }
      
      .new-chat-section {
        padding: 0.75rem 1rem;
      }
      
      .sessions-list {
        padding: 0 0.75rem;
      }
      
      .session-item {
        padding: 0.75rem;
      }
    }
  `]
})
export class ChatSidebarComponent implements OnInit, OnDestroy {
  chatSessions: ChatSession[] = [];
  currentSession: ChatSession | null = null;
  sidebarOpen: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private personalityService: PersonalityService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.chatService.chatSessions$.subscribe(sessions => {
        this.chatSessions = sessions;
      }),
      this.chatService.currentSession$.subscribe(session => {
        this.currentSession = session;
      }),
      this.chatService.sidebarOpen$.subscribe(open => {
        this.sidebarOpen = open;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  startNewChat(): void {
    this.chatService.clearChat();
    this.chatService.closeSidebar();
  }

  loadSession(sessionId: string): void {
    this.chatService.loadChatSession(sessionId);
    this.chatService.closeSidebar();
  }

  deleteSession(event: Event, sessionId: string): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      this.chatService.deleteChatSession(sessionId);
    }
  }

  closeSidebar(): void {
    this.chatService.closeSidebar();
  }

  trackBySessionId(index: number, session: ChatSession): string {
    return session.id;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getPersonalityAvatar(personalityId: string): string {
    const personality = this.personalityService.getPersonalityById(personalityId);
    return personality?.avatar || '';
  }
}