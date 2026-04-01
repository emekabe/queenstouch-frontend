import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LinkedInService } from '../../../core/services/linkedin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-linkedin-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SpinnerComponent],
  template: `
    <div class="bg-secondary min-vh-100 py-5">
      <app-spinner [show]="isLoading"></app-spinner>
      <div class="container" style="max-width: 800px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>LinkedIn Profile Optimizer</h2>
        </div>

        <div class="card p-4 border-none shadow-sm mb-4">
          <form [formGroup]="linkedinForm" (ngSubmit)="generate()">
            
            <div class="form-group border border-orange rounded p-3 mb-4" style="background: rgba(232,106,45,0.05);">
              <label class="form-label text-orange">Import CV Content</label>
              <p class="small text-muted mb-2">To generate a highly optimized LinkedIn profile, paste your current CV summary or latest experience here.</p>
              <textarea class="form-control" formControlName="currentCvContent" rows="6" placeholder="Paste your CV content..."></textarea>
            </div>

            <div class="form-group mt-3">
              <label class="form-label">Target Industry / Job Title</label>
              <input type="text" class="form-control" formControlName="targetIndustry" placeholder="e.g. Fintech Tech Lead">
            </div>

            <button type="submit" class="btn btn-primary mt-4 w-100" [disabled]="linkedinForm.invalid || isLoading">
              ✨ Optimize LinkedIn Profile
            </button>
          </form>
        </div>

        <div *ngIf="generatedProfile" class="card p-4 border-none shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h4 class="m-0">Your Optimized Profile</h4>
            <button class="btn btn-sm btn-outline-primary" (click)="save()">Save to Profile</button>
          </div>

          <div class="mb-4">
            <h5 class="text-navy mb-2">Headline</h5>
            <div class="p-3 bg-secondary rounded border">
              {{ generatedProfile.headline }}
            </div>
            <p class="small text-muted mt-2">Update your LinkedIn Headline with this keyword-rich summary.</p>
          </div>

          <div class="mb-4">
            <h5 class="text-navy mb-2">About Summary</h5>
            <div class="p-3 bg-secondary rounded border" style="white-space: pre-wrap;">{{ generatedProfile.summary }}</div>
          </div>

          <div class="mb-2">
            <h5 class="text-navy mb-2">Top Skills to Add</h5>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge skill-badge" *ngFor="let skill of generatedProfile.skills">{{ skill }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 { min-height: 100vh; }
    .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
    .bg-secondary { background-color: var(--qt-bg-secondary); }
    .shadow-sm { box-shadow: var(--box-shadow-sm); }
    .border-none { border: none; }
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mb-3 { margin-bottom: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .mt-2 { margin-top: 0.5rem; }
    .m-0 { margin: 0; }
    .pb-2 { padding-bottom: 0.5rem; }
    .w-100 { width: 100%; }
    .border-bottom { border-bottom: 1px solid var(--border-color); }
    .border { border: 1px solid var(--border-color); }
    .rounded { border-radius: 8px; }
    .text-navy { color: var(--qt-navy); }
    .text-orange { color: var(--qt-orange); }
    .border-orange { border-color: var(--qt-orange) !important; }
    .small { font-size: 0.875rem; }
    
    .gap-2 { gap: 0.5rem; }
    .flex-wrap { flex-wrap: wrap; }
    
    .skill-badge {
      background-color: var(--qt-navy);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.85rem;
    }
  `]
})
export class LinkedInGeneratorComponent {
  private fb = inject(FormBuilder);
  private linkedInService = inject(LinkedInService);
  private toast = inject(ToastService);
  private router = inject(Router);

  isLoading = false;
  generatedProfile: any = null;

  linkedinForm = this.fb.group({
    currentCvContent: ['', Validators.required],
    targetIndustry: ['', Validators.required]
  });

  generate() {
    if (this.linkedinForm.invalid) return;
    this.isLoading = true;
    
    this.linkedInService.generate(this.linkedinForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.generatedProfile = res.data;
        this.toast.success('LinkedIn profile optimized successfully!');
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to optimize profile.');
      }
    });
  }

  save() {
    if (!this.generatedProfile) return;
    this.toast.success('LinkedIn profile marked as done!');
    this.router.navigate(['/dashboard']);
  }
}
