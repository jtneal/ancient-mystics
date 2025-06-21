import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Message, Personality } from '../models/personality.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container" [style.background]="currentPersonality?.background || defaultBackground">
      <div class="chat-overlay">
        <!-- Header -->
        <header class="chat-header">
          <div class="header-left">
            <button class="sidebar-toggle" (click)="toggleSidebar()">
              <span class="hamburger-icon">☰</span>
            </button>
            <div class="personality-info" *ngIf="currentPersonality">
              <img [src]="currentPersonality.avatar" [alt]="currentPersonality.name" class="header-avatar">
              <div class="header-text">
                <h2>{{ currentPersonality.name }}</h2>
                <p>{{ currentPersonality.title }}</p>
              </div>
            </div>
          </div>
          <button class="back-button" (click)="goBack()">
            <span>← Back to Selection</span>
          </button>
        </header>

        <!-- Chat Content -->
        <div class="chat-content">
          <!-- Messages -->
          <div class="messages-container" #messagesContainer>
            <div class="messages-list">
              <div 
                *ngFor="let message of messages; trackBy: trackByMessageId"
                class="message"
                [class.user-message]="message.sender === 'user'"
                [class.ai-message]="message.sender === 'ai'"
              >
                <div class="message-content">
                  <div class="message-bubble">
                    <p>{{ message.content }}</p>
                    <div class="message-time">
                      {{ formatTime(message.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div *ngIf="isTyping" class="message ai-message typing-message">
                <div class="message-content">
                  <div class="message-bubble">
                    <div class="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="input-container">
            <div class="input-wrapper">
              <textarea 
                [(ngModel)]="currentMessage" 
                (keydown)="onKeyDown($event)"
                (input)="adjustTextareaHeight()"
                [disabled]="isTyping"
                placeholder="Share your thoughts or ask for guidance... (Shift+Enter for new line)"
                class="message-textarea"
                rows="1"
                #messageTextarea
              ></textarea>
              <button 
                (click)="sendMessage()" 
                [disabled]="!currentMessage.trim() || isTyping"
                class="send-button"
              >
                <span class="send-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .chat-overlay {
      background: rgba(0, 0, 0, 0.8);
      height: 100%;
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(10px);
    }

    .chat-header {
      padding: 1rem 2rem;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sidebar-toggle {
      width: 40px;
      height: 40px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 1.2rem;
    }

    .sidebar-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    .hamburger-icon {
      display: block;
    }

    .personality-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .header-text h2 {
      color: white;
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .header-text p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-size: 0.9rem;
      font-style: italic;
    }

    .back-button {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(-2px);
    }

    .chat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .messages-list {
      max-width: 800px;
      margin: 0 auto;
    }

    .message {
      margin-bottom: 1.5rem;
      display: flex;
      animation: messageSlide 0.3s ease-out;
    }

    @keyframes messageSlide {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .user-message {
      justify-content: flex-end;
    }

    .ai-message {
      justify-content: flex-start;
    }

    .message-content {
      max-width: 70%;
    }

    .message-bubble {
      padding: 1rem 1.5rem;
      border-radius: 20px;
      position: relative;
      word-wrap: break-word;
    }

    .user-message .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 5px;
    }

    .ai-message .message-bubble {
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      border-bottom-left-radius: 5px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .message-bubble p {
      margin: 0;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .message-time {
      font-size: 0.7rem;
      opacity: 0.6;
      margin-top: 0.5rem;
      text-align: right;
    }

    .ai-message .message-time {
      text-align: left;
    }

    .typing-message .message-bubble {
      padding: 1rem 1.5rem;
    }

    .typing-indicator {
      display: flex;
      gap: 0.3rem;
      align-items: center;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #999;
      animation: typing 1.4s infinite;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
      }
      30% {
        transform: translateY(-10px);
        opacity: 1;
      }
    }

    .input-container {
      padding: 1rem 2rem;
      background: rgba(0, 0, 0, 0.9);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .input-wrapper {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }

    .message-textarea {
      flex: 1;
      padding: 1rem 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      font-family: inherit;
      outline: none;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      resize: none;
      overflow: hidden;
      min-height: 50px;
      max-height: 200px;
      line-height: 1.5;
    }

    .message-textarea::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .message-textarea:focus {
      border-color: rgba(255, 255, 255, 0.4);
      background: rgba(255, 255, 255, 0.15);
    }

    .send-button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .send-button:hover:not(:disabled) {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .send-icon {
      transform: rotate(0deg);
      transition: transform 0.3s ease;
    }

    .send-button:hover .send-icon {
      transform: rotate(45deg);
    }

    /* Scrollbar styling */
    .messages-container::-webkit-scrollbar {
      width: 6px;
    }

    .messages-container::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    .messages-container::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }

    .messages-container::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .chat-header {
        padding: 1rem;
      }
      
      .header-left {
        gap: 0.5rem;
      }
      
      .sidebar-toggle {
        width: 36px;
        height: 36px;
        font-size: 1rem;
      }
      
      .personality-info {
        gap: 0.5rem;
      }
      
      .header-text h2 {
        font-size: 1rem;
      }
      
      .header-text p {
        font-size: 0.8rem;
      }
      
      .back-button {
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
      }
      
      .message-content {
        max-width: 85%;
      }
      
      .input-container {
        padding: 1rem;
      }
      
      .input-wrapper {
        gap: 0.5rem;
      }
      
      .message-textarea {
        padding: 0.8rem 1rem;
        font-size: 0.9rem;
        min-height: 45px;
        max-height: 150px;
      }
      
      .send-button {
        width: 45px;
        height: 45px;
      }
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageTextarea') messageTextarea!: ElementRef;

  messages: Message[] = [];
  currentPersonality: Personality | null = null;
  currentMessage: string = '';
  isTyping: boolean = false;
  defaultBackground = 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)';

  private subscriptions: Subscription[] = [];
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
        this.updateTypingState();
      }),
      this.chatService.currentPersonality$.subscribe(personality => {
        this.currentPersonality = personality;
      })
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  adjustTextareaHeight(): void {
    const textarea = this.messageTextarea.nativeElement;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 200; // Max height in pixels
    const minHeight = 50; // Min height in pixels
    
    if (scrollHeight > maxHeight) {
      textarea.style.height = maxHeight + 'px';
      textarea.style.overflowY = 'auto';
    } else if (scrollHeight < minHeight) {
      textarea.style.height = minHeight + 'px';
      textarea.style.overflowY = 'hidden';
    } else {
      textarea.style.height = scrollHeight + 'px';
      textarea.style.overflowY = 'hidden';
    }
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    this.chatService.addUserMessage(this.currentMessage);
    this.currentMessage = '';
    this.isTyping = true;
    
    // Reset textarea height
    setTimeout(() => {
      this.adjustTextareaHeight();
      this.messageTextarea.nativeElement.focus();
    }, 100);
  }

  toggleSidebar(): void {
    this.chatService.toggleSidebar();
  }

  goBack(): void {
    this.chatService.clearChat();
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private updateTypingState(): void {
    const lastMessage = this.messages[this.messages.length - 1];
    this.isTyping = lastMessage?.sender === 'user';
  }
}