import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-ring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="score-ring-wrapper" [style.width.px]="size" [style.height.px]="size">
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 100 100">
        <circle
          class="bg-circle"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#E5E7EB"
          stroke-width="10"
        />
        <circle
          class="progress-circle"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          [attr.stroke]="color"
          stroke-width="10"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="strokeDashoffset"
          transform="rotate(-90 50 50)"
        />
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dy=".3em" 
          class="score-text" 
          [attr.fill]="color">
          {{ score }}
        </text>
      </svg>
    </div>
  `,
  styles: [`
    .score-ring-wrapper {
      position: relative;
      display: inline-block;
    }
    .progress-circle {
      transition: stroke-dashoffset 1s ease-out, stroke 0.3s;
    }
    .score-text {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 28px;
    }
  `]
})
export class ScoreRingComponent implements OnChanges {
  @Input() score: number = 0; // 0 to 100
  @Input() size: number = 100;

  circumference = 2 * Math.PI * 45;
  strokeDashoffset = this.circumference;
  color = '#28a745'; // default green

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score']) {
      this.updateProgress();
    }
  }

  private updateProgress() {
    const validScore = Math.max(0, Math.min(100, this.score));
    const offset = this.circumference - (validScore / 100) * this.circumference;
    
    // Animate offset
    setTimeout(() => {
      this.strokeDashoffset = offset;
    }, 50);

    // Color code
    if (validScore >= 80) {
      this.color = '#28a745'; // Green
    } else if (validScore >= 50) {
      this.color = '#ffc107'; // Yellow
    } else {
      this.color = '#dc3545'; // Red
    }
  }
}
