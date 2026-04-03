import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../logo/logo.component';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <header class="navbar bg-white border-bottom shadow-sm">
      <div class="container d-flex justify-content-between align-items-center py-3">
        <a routerLink="/dashboard" class="logo-link">
          <app-logo [height]="36"></app-logo>
        </a>
        <div class="user-menu d-flex align-items-center gap-3">
          <span class="user-greeting" *ngIf="user">Hi, {{ user.firstName }}</span>
          <button (click)="logout()" class="btn btn-sm btn-outline-danger" style="border-radius: 6px;">Logout</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar { position: sticky; top: 0; z-index: 1050; background: #fff; }
    .logo-link { text-decoration: none; display: flex; align-items: center; }
    .user-greeting { font-weight: 500; color: var(--qt-navy); font-size: 0.95rem; }
    .gap-3 { gap: 1rem; }
    .shadow-sm { box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .btn-outline-danger {
      color: var(--qt-danger);
      border-color: var(--qt-danger);
      background: transparent;
      transition: all 0.2s;
    }
    .btn-outline-danger:hover {
      background-color: var(--qt-danger);
      color: #fff;
    }
  `]
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  user: User | null = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      this.user = u as User;
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
