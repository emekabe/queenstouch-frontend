import { Component, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="admin-wrapper d-flex">
      <!-- Sidebar -->
      <nav class="sidebar bg-navy text-white min-vh-100 p-3 shadow">
        <div class="sidebar-header mb-4 px-2 d-flex align-items-center">
          <div class="qt-logo fs-4 fw-bold text-orange">
            QT<span class="text-white">Admin</span>
          </div>
        </div>

        <ul class="nav flex-column gap-2">
          <li class="nav-item">
            <a
              routerLink="/admin/dashboard"
              routerLinkActive="active"
              class="nav-link text-white rounded p-2"
            >
              <span class="icon me-2">📊</span> Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a
              routerLink="/admin/users"
              routerLinkActive="active"
              class="nav-link text-white rounded p-2"
            >
              <span class="icon me-2">👥</span> Users
            </a>
          </li>
          <li class="nav-item">
            <a
              routerLink="/admin/orders"
              routerLinkActive="active"
              class="nav-link text-white rounded p-2"
            >
              <span class="icon me-2">🛍️</span> Orders
            </a>
          </li>
          <li class="nav-item">
            <a
              routerLink="/admin/premium"
              routerLinkActive="active"
              class="nav-link text-white rounded p-2"
            >
              <span class="icon me-2">⭐</span> Premium Requests
            </a>
          </li>
          <li class="nav-item">
            <a
              routerLink="/admin/pricing"
              routerLinkActive="active"
              class="nav-link text-white rounded p-2"
            >
              <span class="icon me-2">💰</span> Pricing Mgmt
            </a>
          </li>
        </ul>

        <div class="mt-auto pt-4 border-top border-secondary">
          <button class="btn btn-outline-light w-100" (click)="logout()">Logout</button>
        </div>
      </nav>

      <!-- Main Content Area -->
      <div class="content-area flex-grow-1 bg-light min-vh-100">
        <!-- Topnav -->
        <header
          class="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center sticky-top"
        >
          <h5 class="m-0 text-navy">Admin Portal</h5>
          <div class="d-flex align-items-center">
            <div class="badge bg-orange text-white px-3 py-2 rounded-pill">Admin User</div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-4">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-wrapper {
        display: flex;
        width: 100%;
      }
      .bg-navy {
        background-color: var(--qt-navy);
      }
      .bg-orange {
        background-color: var(--qt-orange);
      }
      .text-orange {
        color: var(--qt-orange);
      }
      .text-white {
        color: white;
      }
      .bg-light {
        background-color: #f8f9fa;
      }
      .bg-white {
        background-color: #ffffff;
      }

      .min-vh-100 {
        min-height: 100vh;
      }
      .flex-grow-1 {
        flex-grow: 1;
      }

      .sidebar {
        width: 260px;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        z-index: 1000;
      }

      .content-area {
        margin-left: 260px;
        width: calc(100% - 260px);
      }

      .nav-link {
        transition: all 0.2s;
        display: flex;
        align-items: center;
        text-decoration: none;
      }

      .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .nav-link.active {
        background-color: var(--qt-orange);
        font-weight: 500;
      }

      .gap-2 {
        gap: 0.5rem;
      }
      .p-2 {
        padding: 0.5rem;
      }
      .p-3 {
        padding: 1rem;
      }
      .p-4 {
        padding: 1.5rem;
      }
      .px-2 {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }
      .px-4 {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
      .py-3 {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }

      .shadow {
        box-shadow: var(--box-shadow-md);
      }
      .shadow-sm {
        box-shadow: var(--box-shadow-sm);
      }

      .d-flex {
        display: flex;
      }
      .flex-column {
        flex-direction: column;
      }
      .align-items-center {
        align-items: center;
      }
      .justify-content-between {
        justify-content: space-between;
      }

      .m-0 {
        margin: 0;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .me-2 {
        margin-right: 0.5rem;
      }
      .mt-auto {
        margin-top: auto;
      }
      .w-100 {
        width: 100%;
      }

      .rounded {
        border-radius: 4px;
      }
      .rounded-pill {
        border-radius: 50rem;
      }

      .fs-4 {
        font-size: 1.5rem;
      }
      .fw-bold {
        font-weight: bold;
      }

      .border-top {
        border-top: 1px solid;
      }
      .border-secondary {
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      .sticky-top {
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .btn-outline-light {
        color: #f8f9fa;
        border-color: #f8f9fa;
        background: transparent;
        padding: 0.375rem 0.75rem;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-outline-light:hover {
        color: var(--qt-navy);
        background-color: #f8f9fa;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
    `,
  ],
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
