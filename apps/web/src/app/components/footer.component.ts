import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <p class="copyright">Copyright (c) 2025 JNealCodes. All Rights Reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: rgba(0, 0, 0, 0.9);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem 0;
      position: relative;
      z-index: 10;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      text-align: center;
    }

    .copyright {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      margin: 0;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .footer-content {
        padding: 0 1rem;
      }
      
      .copyright {
        font-size: 0.8rem;
      }
    }
  `]
})
export class FooterComponent {}