import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  template: `
    <div class="logo-container" [style.height.px]="height">
      <svg width="100%" height="100%" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <text
          x="10"
          y="65"
          font-family="Inter, sans-serif"
          font-weight="900"
          font-size="48"
          fill="#0D1B2A"
          letter-spacing="2"
        >
          QUEENS
          <tspan fill="#E86A2D">TOUCH</tspan>
        </text>
      </svg>
    </div>
  `,
  styles: [
    `
      .logo-container {
        display: inline-block;
        min-width: 150px;
      }
    `,
  ],
})
export class LogoComponent {
  @Input() height: number = 40;
}
