import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  template: `
    @if (show) {
      <div class="spinner-overlay">
        <div class="spinner"></div>
      </div>
    }
  `,
  styles: [
    `
      .spinner-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(13, 27, 42, 0.2);
        border-top-color: #e86a2d;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class SpinnerComponent {
  @Input() show: boolean = false;
}
