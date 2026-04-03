import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CvService } from '../../../core/services/cv.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ScoreRingComponent } from '../../../shared/components/score-ring/score-ring.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent, ScoreRingComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="builder-layout bg-secondary min-vh-100 pb-5">
      <app-spinner [show]="isLoading"></app-spinner>
      
      <!-- Progress Sub-Navbar -->
      <div class="bg-white border-bottom sticky-sub-nav py-3">
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
                        <div class="form-group" style="grid-column: span 2;">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" formControlName="currentJob" [id]="'currentJob' + i">
                            <label class="form-check-label" [for]="'currentJob' + i">I currently work here</label>
                          </div>
                        </div>
                        <div class="form-group" *ngIf="!exp.get('currentJob')?.value">
                          <label class="form-label">End Date</label>
                          <input type="month" class="form-control" formControlName="endDate">
                        </div>
                        <div class="form-group" *ngIf="exp.get('currentJob')?.value">
                          <label class="form-label text-muted d-block pt-4">Present</label>
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

                <!-- STEP 4: Education -->
                <div *ngIf="currentStep === 4" class="step-content">
                  <p class="text-muted mb-4">List your academic background.</p>
                  <div formArrayName="education" *ngFor="let edu of educationArray.controls; let i=index" class="mb-4 p-3 border rounded">
                    <div [formGroupName]="i">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="m-0">Education #{{ i + 1 }}</h5>
                        <button type="button" class="btn btn-sm text-danger" (click)="removeEducation(i)">&times; Remove</button>
                      </div>
                      <div class="grid-2">
                        <div class="form-group">
                          <label class="form-label">Degree</label>
                          <input type="text" class="form-control" formControlName="degree">
                        </div>
                        <div class="form-group">
                          <label class="form-label">Field of Study</label>
                          <input type="text" class="form-control" formControlName="fieldOfStudy">
                        </div>
                        <div class="form-group" style="grid-column: span 2;">
                          <label class="form-label">Institution</label>
                          <input type="text" class="form-control" formControlName="institution">
                        </div>
                        <div class="form-group">
                          <label class="form-label">Start Date</label>
                          <input type="month" class="form-control" formControlName="startDate">
                        </div>
                        <div class="form-group">
                          <label class="form-label">End Date</label>
                          <input type="month" class="form-control" formControlName="endDate">
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-outline-secondary w-100" (click)="addEducation()">+ Add Education</button>
                </div>

                <!-- STEP 5: Skills -->
                <div *ngIf="currentStep === 5" class="step-content">
                  <p class="text-muted mb-4">Add your technical and soft skills.</p>
                  <div formArrayName="skills">
                    <div *ngFor="let skill of skillsArray.controls; let i=index" class="d-flex mb-3" [formGroupName]="i">
                      <div class="flex-grow-1 form-group m-0 me-2">
                        <input type="text" class="form-control" formControlName="name" placeholder="Skill Name, e.g. React.js">
                      </div>
                      <div class="form-group m-0" style="width: 150px;">
                        <select class="form-control" formControlName="level">
                          <option value="BEGINNER">Beginner</option>
                          <option value="INTERMEDIATE">Intermediate</option>
                          <option value="ADVANCED">Advanced</option>
                          <option value="EXPERT">Expert</option>
                        </select>
                      </div>
                      <button type="button" class="btn btn-outline-danger ms-2" (click)="removeSkill(i)">&times;</button>
                    </div>
                  </div>
                  <button type="button" class="btn btn-outline-secondary w-100 mt-2" (click)="addSkill()">+ Add Skill</button>
                </div>

                <!-- STEP 6: Projects -->
                <div *ngIf="currentStep === 6" class="step-content">
                  <p class="text-muted mb-4">Highlight key projects if you have them.</p>
                  <div formArrayName="projects" *ngFor="let proj of projectsArray.controls; let i=index" class="mb-4 p-3 border rounded">
                    <div [formGroupName]="i">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="m-0">Project #{{ i + 1 }}</h5>
                        <button type="button" class="btn btn-sm text-danger" (click)="removeProject(i)">&times; Remove</button>
                      </div>
                      <div class="grid-2">
                        <div class="form-group">
                          <label class="form-label">Title</label>
                          <input type="text" class="form-control" formControlName="title">
                        </div>
                        <div class="form-group">
                          <label class="form-label">Link (optional)</label>
                          <input type="url" class="form-control" formControlName="link">
                        </div>
                        <div class="form-group" style="grid-column: span 2;">
                          <label class="form-label">Description</label>
                          <textarea class="form-control" formControlName="description" rows="3"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-outline-secondary w-100" (click)="addProject()">+ Add Project</button>
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
    .sticky-sub-nav { position: sticky; top: 73px; z-index: 10; }
    
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
  private cdr = inject(ChangeDetectorRef);

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
    experience: this.fb.array([]),
    education: this.fb.array([]),
    skills: this.fb.array([]),
    projects: this.fb.array([])
  });

  get experienceArray() {
    return this.cvForm.get('experience') as FormArray;
  }
  
  get educationArray() {
    return this.cvForm.get('education') as FormArray;
  }
  
  get skillsArray() {
    return this.cvForm.get('skills') as FormArray;
  }
  
  get projectsArray() {
    return this.cvForm.get('projects') as FormArray;
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
    this.cvService.getById(this.cvId).subscribe({
      next: (res: any) => {
        const cv = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
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
              currentJob: [e.currentJob || false],
              description: [e.description || '']
            });
            this.experienceArray.push(group);
          });
        }
        if (cv.education && Array.isArray(cv.education)) {
          this.educationArray.clear();
          cv.education.forEach((e: any) => {
            this.educationArray.push(this.fb.group({
              institution: [e.institution || ''],
              degree: [e.degree || ''],
              fieldOfStudy: [e.fieldOfStudy || ''],
              startDate: [e.startDate || ''],
              endDate: [e.endDate || '']
            }));
          });
        }
        if (cv.skills && Array.isArray(cv.skills)) {
          this.skillsArray.clear();
          cv.skills.forEach((s: any) => {
            this.skillsArray.push(this.fb.group({
              name: [s.name || ''],
              level: [s.level || 'INTERMEDIATE']
            }));
          });
        }
        // Projects aren't in standard CvModel, but stored in extra data if user uses CV Builder, but we handle it
        if (cv.projects && Array.isArray(cv.projects)) {
          this.projectsArray.clear();
          cv.projects.forEach((p: any) => {
            this.projectsArray.push(this.fb.group({
              title: [p.title || ''],
              link: [p.link || ''],
              description: [p.description || '']
            }));
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
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

  addEducation() {
    this.educationArray.push(this.fb.group({
      institution: [''],
      degree: [''],
      fieldOfStudy: [''],
      startDate: [''],
      endDate: ['']
    }));
  }

  removeEducation(index: number) {
    this.educationArray.removeAt(index);
  }

  addSkill() {
    this.skillsArray.push(this.fb.group({
      name: [''],
      level: ['INTERMEDIATE']
    }));
  }

  removeSkill(index: number) {
    this.skillsArray.removeAt(index);
  }

  addProject() {
    this.projectsArray.push(this.fb.group({
      title: [''],
      link: [''],
      description: ['']
    }));
  }

  removeProject(index: number) {
    this.projectsArray.removeAt(index);
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

  saveDraft(onSuccess?: () => void) {
    this.isLoading = true;
    const v = this.cvForm.value;
    
    // 1. Map Personal Info
    const personalInfoPayload = {
      fullName: `${v.personalInfo.firstName} ${v.personalInfo.lastName}`.trim(),
      email: v.personalInfo.email,
      phone: v.personalInfo.phone,
      linkedinUrl: v.personalInfo.linkedin,
      portfolioUrl: v.personalInfo.portfolio,
      title: v.personalInfo.targetJobTitle,
      summary: v.professionalSummary
    };

    const obs$ = this.cvId 
      ? this.cvService.updateSection(this.cvId, 'personal-info', personalInfoPayload)
      : this.cvService.create(personalInfoPayload);
      
    obs$.subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (!this.cvId) {
          this.cvId = res.data.id;
          this.cvForm.get('id')?.setValue(this.cvId);
        }
        this.cdr.detectChanges();
        
        // 2. Map other sections if they exist and we are beyond step 1
        if (this.cvId) {
          if (this.currentStep === 3) {
            const workExperiences = v.experience.map((exp: any) => ({
              jobTitle: exp.jobTitle,
              company: exp.company,
              startDate: exp.startDate,
              endDate: exp.endDate,
              current: exp.currentJob,
              bullets: exp.description ? [exp.description] : []
            }));
            this.cvService.updateSection(this.cvId, 'experience', { workExperiences }).subscribe();
          }

          if (this.currentStep === 4) {
            const educations = v.education.map((edu: any) => ({
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy,
              startDate: edu.startDate,
              endDate: edu.endDate
            }));
            this.cvService.updateSection(this.cvId, 'education', { educations }).subscribe();
          }

          if (this.currentStep === 5) {
            const skills = v.skills.map((s: any) => ({
              name: s.name,
              level: s.level
            }));
            this.cvService.updateSection(this.cvId, 'skills', { skills }).subscribe();
          }
        }

        if (onSuccess) {
          this.toast.success('Auto-saved as draft before processing.');
          onSuccess();
        } else {
          this.toast.success('CV draft saved successfully.');
        }
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
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

    const v = this.cvForm.value;
    const skills = v.skills.map((s: any) => s.name).join(', ');
    const achievements = v.experience.map((e: any) => e.description).join('\n');
    
    this.saveDraft(() => {
      this.isLoading = true;
      const payload = {
        jobTitle,
        yearsOfExperience: 'Several years', // Placeholder as not explicitly collected yet
        skills,
        achievements
      };
      
      this.cvService.generateSummary(this.cvId!, payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.cvForm.get('professionalSummary')?.setValue(res.data.summary);
          this.toast.success('Summary generated via AI.');
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toast.error('Failed to generate summary.');
        }
      });
    });
  }

  buildAchievement(index: number) {
    const control = this.experienceArray.at(index).get('description');
    if (!control?.value) {
      this.toast.error('Please enter a draft task or achievement to rewrite.');
      return;
    }
    
    this.isLoading = true;
    this.cvService.generateAchievement({ 
      role: this.experienceArray.at(index).get('jobTitle')?.value || 'Professional',
      task: control.value,
      result: 'Significant impact' // Placeholder
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        control.setValue(res.data.bullet);
        this.toast.success('Achievement improved via AI.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to rewrite achievement.');
      }
    });
  }

  scoreCv() {
    this.saveDraft(() => {
      this.isLoading = true;
      this.cvService.scoreCv(this.cvId!).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.cvScore = res.data.score || res.data;
          this.toast.success('CV successfully analyzed!');
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toast.error('Failed to score CV.');
        }
      });
    });
  }

  finish() {
    this.saveDraft();
    this.router.navigate(['/dashboard']);
  }
}
