import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Personality } from '../models/personality.model';
import { PersonalityService } from '../services/personality.service';
import { ChatService } from '../services/chat.service';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-personality-selection',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  template: `
    <div class="personality-selection">
      <div class="container">
        <header class="header">
          <h1 class="title">Choose Your Mystic Guide</h1>
          <p class="subtitle">Select an ancient wisdom teacher to guide your spiritual journey</p>
        </header>

        <div class="personalities-grid">
          <div 
            *ngFor="let personality of personalities" 
            class="personality-card"
            [style.background]="personality.background"
            (click)="selectPersonality(personality.id)"
          >
            <div class="card-content">
              <div class="avatar-container">
                <img [src]="personality.avatar" [alt]="personality.name" class="avatar">
                <div class="avatar-glow"></div>
              </div>
              
              <div class="personality-info">
                <h3 class="personality-name">{{ personality.name }}</h3>
                <p class="personality-title">{{ personality.title }}</p>
                <p class="personality-description">{{ personality.description }}</p>
                
                <div class="traits">
                  <span *ngFor="let trait of personality.traits" class="trait-tag">
                    {{ trait }}
                  </span>
                </div>
                
                <div class="specialties">
                  <h4>Specialties:</h4>
                  <ul>
                    <li *ngFor="let specialty of personality.specialties">{{ specialty }}</li>
                  </ul>
                </div>
              </div>
              
              <div class="card-overlay">
                <div class="select-button">
                  <span>Begin Conversation</span>
                  <div class="button-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .personality-selection {
      min-height: 100vh;
      background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
      display: flex;
      flex-direction: column;
    }

    .container {
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .title {
      font-size: 3rem;
      background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #a0a0a0;
      max-width: 600px;
      margin: 0 auto;
    }

    .personalities-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 2rem;
    }

    .personality-card {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      height: 500px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .personality-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    .card-content {
      position: relative;
      height: 100%;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .avatar-container {
      position: relative;
      align-self: center;
      margin-bottom: 1.5rem;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid rgba(255, 255, 255, 0.5);
      position: relative;
      z-index: 2;
    }

    .avatar-glow {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.1); opacity: 1; }
    }

    .personality-info {
      flex: 1;
      text-align: center;
      color: white;
    }

    .personality-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .personality-title {
      font-size: 1rem;
      opacity: 0.9;
      margin-bottom: 1rem;
      font-style: italic;
    }

    .personality-description {
      font-size: 0.9rem;
      line-height: 1.5;
      opacity: 0.8;
      margin-bottom: 1rem;
    }

    .traits {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .trait-tag {
      padding: 0.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      font-size: 0.8rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .specialties {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .specialties h4 {
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .specialties ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .specialties li {
      padding: 0.2rem 0;
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .personality-card:hover .card-overlay {
      opacity: 1;
    }

    .select-button {
      position: relative;
      padding: 1rem 2rem;
      background: linear-gradient(45deg, #ffd700, #ff6b6b);
      border-radius: 30px;
      color: white;
      font-weight: 600;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      overflow: hidden;
    }

    .button-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: rotate(45deg);
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%) rotate(45deg); }
      100% { transform: translateX(100%) rotate(45deg); }
    }

    /* Responsive breakpoints */
    @media (max-width: 1200px) {
      .personalities-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
      
      .container {
        max-width: 1000px;
      }
    }

    @media (max-width: 768px) {
      .personalities-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .personality-card {
        height: 450px;
      }
      
      .title {
        font-size: 2rem;
      }
      
      .container {
        padding: 1rem;
        max-width: 100%;
      }
    }

    @media (max-width: 480px) {
      .card-content {
        padding: 1.5rem;
      }
      
      .personality-card {
        height: 400px;
      }
      
      .avatar {
        width: 60px;
        height: 60px;
      }
      
      .personality-name {
        font-size: 1.3rem;
      }
      
      .personality-description {
        font-size: 0.85rem;
      }
    }
  `]
})
export class PersonalitySelectionComponent {
  personalities: Personality[] = [];

  constructor(
    private personalityService: PersonalityService,
    private chatService: ChatService
  ) {
    this.personalities = this.personalityService.getPersonalities();
  }

  selectPersonality(personalityId: string): void {
    this.chatService.setPersonality(personalityId);
  }
}