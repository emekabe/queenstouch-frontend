import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CoverLetterService } from '../../../core/services/cover-letter.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-cover-letter-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, SpinnerComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="bg-secondary min-vh-100 py-5">
      <app-spinner [show]="isLoading"></app-spinner>
      <div class="container" style="max-width: 800px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Write Cover Letter</h2>
          <a routerLink="/cover-letters/list" class="btn btn-outline-secondary btn-sm">Back to List</a>
        </div>

        <div class="card p-4 border-none shadow-sm">
          <form [formGroup]="clForm" (ngSubmit)="generate()">
            
            <div class="form-group">
              <label class="form-label">Job Title</label>
              <input type="text" class="form-control" formControlName="jobTitle" placeholder="e.g. Product Manager">
            </div>

            <div class="form-group mt-3">
              <label class="form-label">Company Name</label>
              <input type="text" class="form-control" formControlName="companyName" placeholder="e.g. Google">
            </div>

            <div class="form-group mt-3">
              <label class="form-label">Job Description (Optional but recommended)</label>
              <textarea class="form-control" formControlName="jobDescription" rows="5" placeholder="Paste the JD here..."></textarea>
            </div>

            <div class="form-group mt-3">
              <label class="form-label">Your Key Experiences / Notes</label>
              <textarea class="form-control" formControlName="userExperience" rows="3" placeholder="I have 5 years of agile experience..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary mt-4 w-100" [disabled]="clForm.invalid || isLoading">
              ✨ Generate Cover Letter
            </button>
          </form>

          <hr class="my-5" *ngIf="generatedContent">

          <div *ngIf="generatedContent">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4>Generated Cover Letter</h4>
              <button class="btn btn-sm btn-outline-secondary" (click)="save()">Done</button>
            </div>
            
            <textarea class="form-control mb-3" rows="15" [(ngModel)]="generatedContent"></textarea>
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
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .my-5 { margin-top: 3rem; margin-bottom: 3rem; }
    .w-100 { width: 100%; }
    hr { border-top: 1px solid var(--border-color); }
  `]
})
export class CoverLetterBuilderComponent {
  private fb = inject(FormBuilder);
  private clService = inject(CoverLetterService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;
  generatedContent = '';

  clForm = this.fb.group({
    jobTitle: ['', Validators.required],
    companyName: ['', Validators.required],
    jobDescription: [''],
    userExperience: ['']
  });

  generate() {
    if (this.clForm.invalid) return;
    this.isLoading = true;
    const v = this.clForm.value;
    const combinedExp = [v.jobDescription, v.userExperience]
      .filter(x => !!x?.trim())
      .join('\n\n') || 'General application';

    const payload = {
      jobTitle: v.jobTitle,
      companyName: v.companyName,
      relevantExperience: combinedExp,
      keySkills: []
    };

    this.clService.create(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.generatedContent = res.data.generatedContent || '';
        this.toast.success('Cover letter generated and saved!');
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to generate cover letter.');
      }
    });
  }

  save() {
    if (!this.generatedContent) return;
    this.router.navigate(['/cover-letters/list']);
  }
}
