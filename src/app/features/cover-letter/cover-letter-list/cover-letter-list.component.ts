import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CoverLetterService } from '../../../core/services/cover-letter.service';
import { OrderService } from '../../../core/services/order.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ToastService } from '../../../shared/services/toast.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-cover-letter-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container py-5 min-vh-100">
      <app-spinner [show]="isLoading"></app-spinner>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>My Cover Letters</h2>
        <a routerLink="/cover-letters/new" class="btn btn-primary">+ Write New</a>
      </div>

      <div class="card p-0 shadow-sm border-none overflow-hidden">
        <table class="table mb-0">
          <thead class="bg-secondary">
            <tr>
              <th>Target Role</th>
              <th>Company</th>
              <th>Date Created</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (cl of coverLetters; track cl) {
              <tr>
                <td class="fw-500">{{ cl.jobTitle }}</td>
                <td>{{ cl.companyName }}</td>
                <td>{{ cl.createdAt | date: 'mediumDate' }}</td>
                <td class="text-right">
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    (click)="downloadCL(cl.id, 'PDF')"
                  >
                    PDF
                  </button>
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    (click)="downloadCL(cl.id, 'DOCX')"
                  >
                    DOCX
                  </button>
                  <button
                    class="btn btn-sm text-danger btn-outline-danger"
                    (click)="deleteCL(cl.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            }
            @if (coverLetters.length === 0) {
              <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                  You haven't generated any cover letters yet.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1000px;
        margin: 0 auto;
      }
      .min-vh-100 {
        min-height: 100vh;
      }
      .py-5 {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
      .d-flex {
        display: flex;
      }
      .justify-content-between {
        justify-content: space-between;
      }
      .align-items-center {
        align-items: center;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .p-0 {
        padding: 0 !important;
      }
      .mb-0 {
        margin-bottom: 0 !important;
      }
      .py-4 {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
      }
      .shadow-sm {
        box-shadow: var(--box-shadow-sm);
      }
      .border-none {
        border: none;
      }
      .overflow-hidden {
        overflow: hidden;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table th,
      .table td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
        text-align: left;
      }
      .table th {
        font-weight: 600;
        color: var(--qt-navy);
      }
      .text-right {
        text-align: right !important;
      }
      .bg-secondary {
        background-color: var(--qt-bg-secondary);
      }
      .fw-500 {
        font-weight: 500;
      }

      .btn-outline-secondary {
        color: var(--qt-navy);
        border: 1px solid var(--border-color);
        background: transparent;
      }
      .btn-outline-secondary:hover {
        background: var(--qt-bg-secondary);
      }
      .btn-outline-danger {
        border: 1px solid transparent;
        background: transparent;
      }
      .btn-outline-danger:hover {
        background: rgba(220, 53, 69, 0.1);
      }
      .me-2 {
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class CoverLetterListComponent implements OnInit {
  clService = inject(CoverLetterService);
  orderService = inject(OrderService);
  toast = inject(ToastService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  coverLetters: any[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadCoverLetters();
  }

  loadCoverLetters() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.clService.list().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.coverLetters = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load cover letters.');
      },
    });
  }

  deleteCL(id: string) {
    if (confirm('Are you sure you want to delete this cover letter?')) {
      this.isLoading = true;
      this.clService.delete(id).subscribe({
        next: () => {
          this.toast.success('Cover letter deleted.');
          this.loadCoverLetters();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toast.error('Failed to delete cover letter.');
        },
      });
    }
  }

  downloadCL(id: string, format: 'PDF' | 'DOCX') {
    this.isLoading = true;
    this.clService.download(id, format).subscribe({
      next: (blob) => {
        this.isLoading = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CoverLetter-${id}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 402 || err.status === 403) {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/orders/checkout', 'cover_letter', id]);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toast.error('Failed to download Cover Letter.');
        }
      },
    });
  }
}
