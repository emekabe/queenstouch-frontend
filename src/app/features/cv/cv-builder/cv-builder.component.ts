import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CvService } from '../../../core/services/cv.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ScoreRingComponent } from '../../../shared/components/score-ring/score-ring.component';

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent, ScoreRingComponent],
  template: `
    <div class="builder-layout bg-secondary min-vh-100 pb-5">
      <app-spinner [show]="isLoading"></app-spinner>
      
      <!-- Top Navbar with Progress -->
      <div class="bg-white border-bottom sticky-top py-3">
        <div class="container d-flex justify-content-between align-items-center">
          <h4 class="m-0 text-navy">CV Builder</h4>
          
          <div class="progress-container flex-grow-1 mx-4">
            <div class="progress" style="height: 8px; border-radius: 4px;">
              <div 
                class="progress-bar bg-orange" 
                role="progressbar" 
                [style.width.%]="(currentStep / totalSteps) * 100">
              </div>
            </div>
            <div class="d-flex justify-content-between mt-2 small text-muted">
              <span>Step {{ currentStep }} of {{ totalSteps }}</span>
              <span>{{ stepTitles[currentStep - 1] }}</span>
            </div>
          </div>
          
          <button class="btn btn-outline-secondary btn-sm" (click)="saveDraft()">Save Draft</button>
        </div>
      </div>

      <div class="container mt-4">
        <div class="row row-layout">
          <!-- Form Area -->
          <div class="col-form">
            <div class="card p-4 shadow-sm border-none">
              <h3 class="mb-4">{{ stepTitles[currentStep - 1] }}</h3>
              
              <form [formGroup]="cvForm">
                
                <!-- STEP 1: Personal Info -->
                <div *ngIf="currentStep === 1" formGroupName="personalInfo" class="step-content">
                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label">First Name</label>
                      <input type="text" class="form-control" formControlName="firstName">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Last Name</label>
                      <input type="text" class="form-control" formControlName="lastName">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" formControlName="email">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Phone</label>
                      <input type="tel" class="form-control" formControlName="phone">
                    </div>
                    <div class="form-group">
                      <label class="form-label">LinkedIn (Optional)</label>
                      <input type="url" class="form-control" formControlName="linkedin">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Portfolio (Optional)</label>
                      <input type="url" class="form-control" formControlName="portfolio">
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                      <label class="form-label">Target Job Title</label>
                      <input type="text" class="form-control" formControlName="targetJobTitle" placeholder="e.g. Senior Software Engineer">
                    </div>
                  </div>
                </div>

                <!-- STEP 2: Summary -->
                <div *ngIf="currentStep === 2" class="step-content">
                  <div class="form-group">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label m-0">Professional Summary</label>
                      <button type="button" class="btn btn-sm btn-outline-primary" (click)="generateSummary()">
                        ✨ Generate with AI
                      </button>
                    </div>
                    <p class="small text-muted mb-3">Highlight your top achievements and core expertise.</p>
                    <textarea class="form-control" formControlName="professionalSummary" rows="6" placeholder="I am a highly driven professional..."></textarea>
                  </div>
                </div>

                <!-- STEP 3: Experience -->
                <div *ngIf="currentStep === 3" class="step-content">
                  <p class="text-muted mb-4">List your work experience in reverse-chronological order.</p>
                  
                  <div formArrayName="experience" *ngFor="let exp of experienceArray.controls; let i=index" class="mb-4 p-3 border rounded">
                    <div [formGroupName]="i">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="m-0">Experience #{{ i + 1 }}</h5>
                        <button type="button" class="btn btn-sm text-danger" (click)="removeExperience(i)">&times; Remove</button>
                      </div>
                      
                      <div class="grid-2">
                        <div class="form-group">
                          <label class="form-label">Job Title</label>
                          <input type="text" class="form-control" formControlName="jobTitle">
                        </div>
                        <div class="form-group">
                          <label class="form-label">Company</label>
                          <input type="text" class="form-control" formControlName="company">
                        </div>
                        <div class="form-group">
                          <label class="form-label">Start Date</label>
                          <input type="month" class="form-control" formControlName="startDate">
                        </div>
                        <div class="form-group">
                          <label class="form-label">End Date</label>
                          <input type="month" class="form-control" formControlName="endDate">
                        </div>
                        <div class="form-group" style="grid-column: span 2;">
                          <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="form-label m-0">Description & Achievements</label>
                            <button type="button" class="btn btn-sm btn-outline-primary" (click)="buildAchievement(i)">
                              ✨ Build Achievement
                            </button>
                          </div>
                          <textarea class="form-control" formControlName="description" rows="4"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-outline-secondary w-100" (click)="addExperience()">+ Add Experience</button>
                </div>

                <!-- Step 4, 5, 6, 7 Implementation follows similar pattern -->
                <div *ngIf="currentStep >= 4 && currentStep <= 6" class="step-content text-center py-5">
                  <div class="text-muted mb-3 icon-lg">🚧</div>
                  <h4>[Step {{ currentStep }} Placeholder]</h4>
                  <p class="text-muted">Education, Skills, and Projects will be fully implemented soon.</p>
                </div>

                <div *ngIf="currentStep === 7" class="step-content text-center">
                  <div class="mb-4">
                    <app-score-ring [score]="cvScore" [size]="120"></app-score-ring>
                    <h3 class="mt-3">CV Strength: {{ cvScore >= 80 ? 'Excellent' : (cvScore >= 50 ? 'Good' : 'Needs Work') }}</h3>
                  </div>
                  <button type="button" class="btn btn-outline-primary mb-4" (click)="scoreCv()">✨ Analyze CV with AI</button>
                  <p class="text-muted">Review your information before saving your final CV.</p>
                </div>

              </form>

              <!-- Navigation Buttons -->
              <div class="d-flex justify-content-between mt-5 pt-3 border-top">
                <button 
                  type="button" 
                  class="btn btn-secondary px-4" 
                  [disabled]="currentStep === 1" 
                  (click)="prevStep()">
                  Back
                </button>
                <button 
                  *ngIf="currentStep < totalSteps" 
                  type="button" 
                  class="btn btn-primary px-4" 
                  (click)="nextStep()">
                  Next
                </button>
                <button 
                  *ngIf="currentStep === totalSteps" 
                  type="button" 
                  class="btn btn-primary px-4" 
                  (click)="finish()">
                  Finish & Save
                </button>
              </div>
            </div>
          </div>
          
          <!-- Smart Suggestions Sidebar -->
          <div class="col-sidebar d-none d-lg-block">
            <div class="card p-4 shadow-sm border-none sticky-sidebar">
              <h4 class="mb-3">💡 AI Suggestions</h4>
              <div *ngIf="currentStep === 1" class="suggestion-item">
                <p class="small text-muted mb-2">Ensure your target job title aligns precisely with the roles you are applying for to optimize ATS visibility.</p>
              </div>
              <div *ngIf="currentStep === 2" class="suggestion-item">
                <p class="small text-muted mb-2">A strong summary uses action verbs and quantifies achievements. Click the "Generate with AI" button and we'll draft it based on your target role.</p>
              </div>
              <div *ngIf="currentStep === 3" class="suggestion-item">
                <p class="small text-muted mb-2">Use the "Build Achievement" tool. Input a basic task, and our AI will rewrite it using the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].</p>
              </div>
              <div *ngIf="currentStep === 7" class="suggestion-item">
                <p class="small text-muted mb-2">Our AI calculates your CV score based on impact, brevity, and keyword richness. Score 80+ for the best chance at landing interviews.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-secondary { background-color: var(--qt-bg-secondary); }
    .bg-orange { background-color: var(--qt-orange); }
    .text-navy { color: var(--qt-navy); }
    .min-vh-100 { min-height: 100vh; }
    .pb-5 { padding-bottom: 3rem; }
    .py-3 { padding-top: 1rem; padding-bottom: 1rem; }
    .bg-white { background-color: #fff; }
    .border-bottom { border-bottom: 1px solid var(--border-color); }
    .border-top { border-top: 1px solid var(--border-color); }
    .sticky-top { position: sticky; top: 0; z-index: 10; }
    
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .m-0 { margin: 0; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .mt-5 { margin-top: 3rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 1rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mx-4 { margin-left: 1.5rem; margin-right: 1.5rem; }
    .small { font-size: 0.875rem; }
    .w-100 { width: 100%; }
    .flex-grow-1 { flex-grow: 1; }
    .px-4 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .p-3 { padding: 1rem; }
    .p-4 { padding: 1.5rem; }
    .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
    
    .row-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      align-items: start;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .progress {
      background-color: var(--qt-bg-tertiary);
      overflow: hidden;
    }
    .progress-bar {
      transition: width 0.4s ease;
      height: 100%;
    }
    
    .shadow-sm { box-shadow: var(--box-shadow-sm); }
    .border-none { border: none; }
    .rounded { border-radius: var(--border-radius-md); }
    .border { border: 1px solid var(--border-color); }
    
    .sticky-sidebar {
      position: sticky;
      top: 100px;
    }
    
    .btn-outline-primary {
      color: var(--qt-orange);
      border-color: var(--qt-orange);
      background: transparent;
    }
    .btn-outline-primary:hover {
      color: #fff;
      background-color: var(--qt-orange);
    }
    
    .btn-outline-secondary {
      color: var(--qt-navy);
      border-color: var(--qt-navy);
      background: transparent;
    }
    .btn-outline-secondary:hover {
      color: #fff;
      background-color: var(--qt-navy);
    }
    
    @media (max-width: 992px) {
      .row-layout { grid-template-columns: 1fr; }
      .d-none { display: none !important; }
      .d-lg-block { display: block !important; }
    }
  `]
})
export class CvBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cvService = inject(CvService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  currentStep = 1;
  totalSteps = 7;
  stepTitles = [
    'Personal Information',
    'Professional Summary',
    'Experience',
    'Education',
    'Skills',
    'Projects',
    'Review & Score'
  ];
  
  cvId: string | null = null;
  cvScore = 0;

  cvForm: FormGroup = this.fb.group({
    id: [null],
    personalInfo: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      linkedin: [''],
      portfolio: [''],
      targetJobTitle: ['']
    }),
    professionalSummary: [''],
    experience: this.fb.array([])
  });

  get experienceArray() {
    return this.cvForm.get('experience') as FormArray;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.cvId = params['id'];
        this.loadCv();
      } else {
        // Init one experience block by default
        this.addExperience();
      }
    });
  }

  loadCv() {
    if (!this.cvId) return;
    this.isLoading = true;
    this.cvService.getCv(this.cvId).subscribe({
      next: (cv) => {
        this.isLoading = false;
        // Patch form
        if (cv.personalInfo) {
          this.cvForm.get('personalInfo')?.patchValue(cv.personalInfo);
        }
        if (cv.professionalSummary) {
          this.cvForm.get('professionalSummary')?.patchValue(cv.professionalSummary);
        }
        if (cv.experience && Array.isArray(cv.experience)) {
          this.experienceArray.clear();
          cv.experience.forEach((e: any) => {
            const group = this.fb.group({
              jobTitle: [e.jobTitle || ''],
              company: [e.company || ''],
              startDate: [e.startDate || ''],
              endDate: [e.endDate || ''],
              description: [e.description || '']
            });
            this.experienceArray.push(group);
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load CV draft.');
      }
    });
  }

  addExperience() {
    const group = this.fb.group({
      jobTitle: [''],
      company: [''],
      startDate: [''],
      endDate: [''],
      description: ['']
    });
    this.experienceArray.push(group);
  }

  removeExperience(index: number) {
    this.experienceArray.removeAt(index);
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  saveDraft() {
    this.isLoading = true;
    const data = this.cvForm.value;
    
    // Convert arrays back to proper domain structures before sending
    // For now we map 1:1 since keys mostly match
    
    const obs$ = this.cvId 
      ? this.cvService.updateCvSection(this.cvId, 'personalInfo', data.personalInfo)
      : this.cvService.createCvDraft({ ...data.personalInfo, professionalSummary: data.professionalSummary });
      
    obs$.subscribe({
      next: (res) => {
        this.isLoading = false;
        if (!this.cvId) {
          this.cvId = res.data.id;
          this.cvForm.get('id')?.setValue(this.cvId);
        }
        
        // If continuing, also update other sections that are present
        if (this.cvId && this.currentStep > 1) {
             this.cvService.updateCvSection(this.cvId, 'experience', data.experience).subscribe();
             this.cvService.updateCvSection(this.cvId, 'summary', { summary: data.professionalSummary }).subscribe();
        }

        this.toast.success('CV draft saved successfully.');
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to save CV.');
      }
    });
  }

  generateSummary() {
    const jobTitle = this.cvForm.get('personalInfo.targetJobTitle')?.value;
    const currentSummary = this.cvForm.get('professionalSummary')?.value;
    
    if (!jobTitle) {
      this.toast.error('Please provide a Target Job Title in Step 1 first.');
      return;
    }

    this.isLoading = true;
    this.cvService.generateSummary({ jobTitle, currentSummary }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cvForm.get('professionalSummary')?.setValue(res.data.summary);
        this.toast.success('Summary generated via AI.');
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to generate summary.');
      }
    });
  }

  buildAchievement(index: number) {
    const control = this.experienceArray.at(index).get('description');
    if (!control?.value) {
      this.toast.error('Please enter a draft task or achievement to rewrite.');
      return;
    }
    
    this.isLoading = true;
    this.cvService.buildAchievement({ 
      originalTask: control.value,
      jobTitle: this.experienceArray.at(index).get('jobTitle')?.value || ''
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        control.setValue(res.data.achievement);
        this.toast.success('Achievement improved via AI.');
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to rewrite achievement.');
      }
    });
  }

  scoreCv() {
    if (!this.cvId) {
      this.toast.error('Please save your draft first before scoring.');
      return;
    }
    this.isLoading = true;
    this.cvService.scoreCv(this.cvId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cvScore = res.data.score;
        this.toast.success('CV successfully analyzed!');
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to score CV.');
      }
    });
  }

  finish() {
    this.saveDraft();
    this.router.navigate(['/dashboard']);
  }
}
