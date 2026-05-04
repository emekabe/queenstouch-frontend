import { Component, inject, OnInit } from '@angular/core';

import { RouterModule, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CvService } from '../../core/services/cv.service';
import { CoverLetterService } from '../../core/services/cover-letter.service';
import { OrderService } from '../../core/services/order.service';
import { User } from '../../core/models/user.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="dashboard-bg min-vh-100 py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Dashboard</h2>
          <a routerLink="/cv/new" class="btn btn-primary">+ Build New CV</a>
        </div>

        <div class="stats-grid mb-5">
          <div class="card hover-card stat-card border-none shadow-sm p-4">
            <h5 class="text-muted">Saved CVs</h5>
            <h2 class="mt-2 text-navy">
              @if (!isLoadingStats) {
                <span>{{ cvCount }}</span>
              }
              @if (isLoadingStats) {
                <span class="placeholder-glow"><span class="placeholder col-4"></span></span>
              }
            </h2>
            <a routerLink="/cv/list" class="stretched-link">View All</a>
          </div>
          <div class="card hover-card stat-card border-none shadow-sm p-4">
            <h5 class="text-muted">Cover Letters</h5>
            <h2 class="mt-2 text-navy">
              @if (!isLoadingStats) {
                <span>{{ clCount }}</span>
              }
              @if (isLoadingStats) {
                <span class="placeholder-glow"><span class="placeholder col-4"></span></span>
              }
            </h2>
            <a routerLink="/cover-letters/list" class="stretched-link">View All</a>
          </div>
          <div class="card hover-card stat-card border-none shadow-sm p-4">
            <h5 class="text-muted">Premium Orders</h5>
            <h2 class="mt-2 text-navy">
              @if (!isLoadingStats) {
                <span>{{ orderCount }}</span>
              }
              @if (isLoadingStats) {
                <span class="placeholder-glow"><span class="placeholder col-4"></span></span>
              }
            </h2>
            <a routerLink="/orders/history" class="stretched-link">View All</a>
          </div>
        </div>

        <h3 class="mb-4">Quick Actions</h3>
        <div class="action-grid">
          <div class="card action-card p-4 text-center cursor-pointer" routerLink="/cv/new">
            <div class="icon-circle bg-orange-light text-orange mx-auto mb-3">📄</div>
            <h4>Create CV</h4>
            <p class="text-muted small">
              Use AI to generate professional sections tailored to your target job.
            </p>
          </div>

          <div
            class="card action-card p-4 text-center cursor-pointer"
            routerLink="/cover-letters/new"
          >
            <div class="icon-circle bg-navy-light text-navy mx-auto mb-3">✍️</div>
            <h4>Write Cover Letter</h4>
            <p class="text-muted small">
              Generate an ATS-friendly cover letter in minutes based on the JD.
            </p>
          </div>

          <div class="card action-card p-4 text-center cursor-pointer" routerLink="/linkedin/new">
            <div class="icon-circle bg-info-light text-info mx-auto mb-3">🔗</div>
            <h4>LinkedIn Optimize</h4>
            <p class="text-muted small">
              Update your headline and summary to attract top recruiters.
            </p>
          </div>

          <div
            class="card action-card p-4 text-center cursor-pointer"
            routerLink="/premium/requests"
          >
            <div class="icon-circle bg-success-light text-success mx-auto mb-3">⭐</div>
            <h4>Expert Review</h4>
            <p class="text-muted small">
              Hire an expert to review or completely revamp your documents.
            </p>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [
    `
      .dashboard-bg {
        background-color: var(--qt-bg-secondary);
      }

      .stats-grid,
      .action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .hover-card {
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }
      .hover-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--box-shadow-md);
      }

      .action-card {
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid transparent;
      }
      .action-card:hover {
        border-color: var(--qt-orange);
        box-shadow: 0 10px 20px rgba(232, 106, 45, 0.1);
      }

      .icon-circle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }
      .bg-orange-light {
        background-color: rgba(232, 106, 45, 0.1);
      }
      .text-orange {
        color: var(--qt-orange);
      }

      .bg-navy-light {
        background-color: rgba(13, 27, 42, 0.1);
      }
      .bg-info-light {
        background-color: rgba(23, 162, 184, 0.1);
      }
      .bg-success-light {
        background-color: rgba(40, 167, 69, 0.1);
      }

      .small {
        font-size: 0.875rem;
      }
      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  cvService = inject(CvService);
  clService = inject(CoverLetterService);
  orderService = inject(OrderService);
  cdr = inject(ChangeDetectorRef);

  cvCount = 0;
  clCount = 0;
  orderCount = 0;
  isLoadingStats = true;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoadingStats = true;
    let loaded = 0;
    const checkAll = () => {
      loaded++;
      if (loaded >= 3) {
        this.isLoadingStats = false;
        this.cdr.detectChanges();
      }
    };

    this.cvService.list().subscribe({
      next: (res) => {
        if (res.success && res.data) this.cvCount = res.data.length;
        checkAll();
      },
      error: () => checkAll(),
    });
    this.clService.list().subscribe({
      next: (res) => {
        if (res.success && res.data) this.clCount = res.data.length;
        checkAll();
      },
      error: () => checkAll(),
    });
    this.orderService.listForUser().subscribe({
      next: (res) => {
        if (res.success && res.data) this.orderCount = res.data.length;
        checkAll();
      },
      error: () => checkAll(),
    });
  }
}
