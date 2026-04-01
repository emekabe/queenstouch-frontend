import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <header class="navbar">
      <div class="container nav-content">
        <app-logo [height]="40"></app-logo>
        <div class="nav-links">
          <a *ngIf="!isLoggedIn" routerLink="/auth/login" class="btn btn-secondary">Sign In</a>
          <a *ngIf="!isLoggedIn" routerLink="/auth/register" class="btn btn-primary">Get Started</a>
          <a *ngIf="isLoggedIn" routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
        </div>
      </div>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="hero text-center pt-5 pb-5">
        <div class="container mt-5 mb-5">
          <h1 class="hero-title mt-4">Craft a Winning Global CV</h1>
          <p class="hero-subtitle text-muted mt-3 mb-4">
            Stand out in the global job market with AI-powered insights, ATS-friendly templates, and expert cover letters.
          </p>
          <div class="hero-cta">
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">Build Your CV Now</a>
          </div>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="services bg-secondary py-5">
        <div class="container">
          <h2 class="text-center mb-5">Our Features</h2>
          <div class="grid-3">
            <div class="card p-4 text-center">
              <div class="icon-lg">📄</div>
              <h3 class="mt-3">ATS-Friendly Templates</h3>
              <p class="text-muted">Clean, professional designs that pass automated screening systems.</p>
            </div>
            <div class="card p-4 text-center">
              <div class="icon-lg">🤖</div>
              <h3 class="mt-3">AI-Powered Scoring</h3>
              <p class="text-muted">Get instant feedback on your CV strength and keyword matches.</p>
            </div>
            <div class="card p-4 text-center">
              <div class="icon-lg">✍️</div>
              <h3 class="mt-3">Cover Letter Generator</h3>
              <p class="text-muted">Automatically draft tailored cover letters for your target roles.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing / Premium -->
      <section class="pricing py-5">
        <div class="container text-center">
          <h2 class="mb-4">Premium Expert Services</h2>
          <p class="text-muted mb-5">Need a human touch? Our experts can rewrite and optimize your career documents.</p>
          
          <div class="grid-2" style="max-width: 800px; margin: 0 auto;">
            <div class="card pricing-card text-center p-5">
              <h3>Standard Review</h3>
              <h2 class="price mt-3 mb-4">₦15,000</h2>
              <ul class="text-start mb-4">
                <li>Professional formatting</li>
                <li>Grammar & typos correction</li>
                <li>Keyword optimization</li>
              </ul>
              <a routerLink="/auth/register" class="btn btn-secondary w-100 mt-auto">Get Started</a>
            </div>
            <div class="card pricing-card text-center p-5 popular">
              <div class="badge">Most Popular</div>
              <h3>Complete Overhaul</h3>
              <h2 class="price mt-3 mb-4 text-orange">₦45,000</h2>
              <ul class="text-start mb-4">
                <li>Everything in Review</li>
                <li>Full content rewrite</li>
                <li>Custom Cover Letter</li>
                <li>LinkedIn Optimization</li>
              </ul>
              <a routerLink="/auth/register" class="btn btn-primary w-100 mt-auto">Get Premium</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer py-4 text-center bg-navy text-white">
      <div class="container">
        <app-logo [height]="30" style="filter: brightness(0) invert(1); opacity: 0.5;"></app-logo>
        <p class="mt-3 text-muted" style="color: #adb5bd !important;">&copy; 2026 Queenstouch Global. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      background: white;
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    .hero {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    }
    .hero-title {
      font-size: 3.5rem;
      font-weight: 900;
      line-height: 1.1;
      color: var(--qt-navy);
    }
    .hero-subtitle {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto;
    }
    .btn-lg {
      padding: 0.75rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
    }
    .py-5 { padding-top: 5rem; padding-bottom: 5rem; }
    .bg-secondary { background-color: var(--qt-bg-secondary); }
    .bg-navy { background-color: var(--qt-navy); color: white; }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .icon-lg {
      font-size: 3rem;
      color: var(--qt-orange);
    }
    .text-start { text-align: left; }
    .pricing-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .pricing-card.popular {
      border: 2px solid var(--qt-orange);
      transform: scale(1.05);
      z-index: 10;
    }
    .badge {
      background: var(--qt-orange);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      font-weight: bold;
    }
    .text-orange { color: var(--qt-orange); }
  `]
})
export class LandingComponent {
  authService = inject(AuthService);
  isLoggedIn = this.authService.hasToken(); // simple check for initial render
}
