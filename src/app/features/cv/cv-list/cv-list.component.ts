import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CvService } from '../../../core/services/cv.service';
import { OrderService } from '../../../core/services/order.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ToastService } from '../../../shared/services/toast.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-cv-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container py-5 min-vh-100">
      <app-spinner [show]="isLoading"></app-spinner>
      
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>My Resumes</h2>
        <a routerLink="/cv/new" class="btn btn-primary">+ Create New CV</a>
      </div>

      <div class="card p-0 shadow-sm border-none overflow-hidden">
        <table class="table mb-0">
          <thead class="bg-secondary">
            <tr>
              <th>Job Title / Name</th>
              <th>Last Updated</th>
              <th>Score</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cv of cvs">
              <td>
                <div class="fw-500">{{ cv.personalInfo?.targetJobTitle || 'Untitled CV' }}</div>
                <div class="small text-muted">{{ cv.isDraft ? 'Draft' : 'Completed' }}</div>
              </td>
              <td>{{ cv.updatedAt | date:'mediumDate' }}</td>
              <td>
                <span class="badge" [ngClass]="getScoreClass(cv.score)">{{ cv.score || 0 }} / 100</span>
              </td>
              <td class="text-right">
                <button class="btn btn-sm btn-outline-primary me-2" (click)="downloadCv(cv.id, 'PDF')">PDF</button>
                <button class="btn btn-sm btn-outline-primary me-2" (click)="downloadCv(cv.id, 'DOCX')">DOCX</button>
                <a [routerLink]="['/cv', cv.id]" class="btn btn-sm btn-outline-secondary me-2">Edit</a>
                <button class="btn btn-sm text-danger btn-outline-danger" (click)="deleteCv(cv.id)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="cvs.length === 0">
              <td colspan="4" class="text-center py-4 text-muted">You haven't created any CVs yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 0 auto; }
    .min-vh-100 { min-height: 100vh; }
    .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .mb-4 { margin-bottom: 1.5rem; }
    .p-0 { padding: 0 !important; }
    .mb-0 { margin-bottom: 0 !important; }
    .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .shadow-sm { box-shadow: var(--box-shadow-sm); }
    .border-none { border: none; }
    .overflow-hidden { overflow: hidden; }
    
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); text-align: left; }
    .table th { font-weight: 600; color: var(--qt-navy); }
    .text-right { text-align: right !important; }
    .bg-secondary { background-color: var(--qt-bg-secondary); }
    .fw-500 { font-weight: 500; }
    .small { font-size: 0.875rem; }
    .me-2 { margin-right: 0.5rem; }
    
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .badge.green { background-color: rgba(40, 167, 69, 0.1); color: var(--qt-success); }
    .badge.yellow { background-color: rgba(255, 193, 7, 0.1); color: var(--qt-warning); }
    .badge.red { background-color: rgba(220, 53, 69, 0.1); color: var(--qt-danger); }
    
    .btn-outline-secondary { color: var(--qt-navy); border: 1px solid var(--border-color); background: transparent; }
    .btn-outline-secondary:hover { background: var(--qt-bg-secondary); }
    .btn-outline-danger { border: 1px solid transparent; background: transparent; }
    .btn-outline-danger:hover { background: rgba(220, 53, 69, 0.1); }
  `]
})
export class CvListComponent implements OnInit {
  cvService = inject(CvService);
  orderService = inject(OrderService);
  toast = inject(ToastService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  cvs: any[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadCvs();
  }

  loadCvs() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.cvService.list().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cvs = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Error loading CVs');
      }
    });
  }

  deleteCv(id: string) {
    if (confirm('Are you sure you want to delete this CV?')) {
      this.isLoading = true;
      this.cvService.delete(id).subscribe({
        next: () => {
          this.toast.success('CV deleted');
          this.loadCvs();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toast.error('Failed to delete CV');
        }
      });
    }
  }

  getScoreClass(score: number): string {
    if (!score) return 'red';
    if (score >= 80) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
  }

  downloadCv(id: string, format: 'PDF' | 'DOCX') {
    this.isLoading = true;
    this.cvService.download(id, format).subscribe({
      next: (blob) => {
        this.isLoading = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV-${id}.${format.toLowerCase()}`;
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
           this.router.navigate(['/orders/checkout', 'cv', id]);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toast.error('Failed to download CV.');
        }
      }
    });
  }
}
