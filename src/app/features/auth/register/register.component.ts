import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent, SpinnerComponent],
  template: `
    <div class="auth-layout">
      <app-spinner [show]="isLoading"></app-spinner>
      
      <div class="auth-card card">
        <div class="text-center mb-4">
          <app-logo [height]="50"></app-logo>
          <h2 class="mt-3">Create an Account</h2>
          <p class="text-muted">Start building your global CV today</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="firstName">First Name</label>
              <input id="firstName" type="text" class="form-control" formControlName="firstName" placeholder="First Name">
              <div *ngIf="registerForm.get('firstName')?.touched && registerForm.get('firstName')?.invalid" class="text-danger mt-1" style="font-size: 13px;">
                Required.
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="lastName">Last Name</label>
              <input id="lastName" type="text" class="form-control" formControlName="lastName" placeholder="Last Name">
              <div *ngIf="registerForm.get('lastName')?.touched && registerForm.get('lastName')?.invalid" class="text-danger mt-1" style="font-size: 13px;">
                Required.
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input id="email" type="email" class="form-control" formControlName="email" placeholder="Enter your email">
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="text-danger mt-2" style="font-size: 14px;">
              Please enter a valid email address.
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="phone">Phone Number</label>
            <input id="phone" type="tel" class="form-control" formControlName="phone" placeholder="Enter your phone number">
            <div *ngIf="registerForm.get('phone')?.touched && registerForm.get('phone')?.invalid" class="text-danger mt-1" style="font-size: 13px;">
              Phone number is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="position-relative">
              <input 
                id="password" 
                [type]="showPassword ? 'text' : 'password'" 
                class="form-control" 
                style="padding-right: 45px;"
                formControlName="password" 
                placeholder="Create a strong password">
              <span 
                class="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" 
                (click)="togglePassword()" 
                style="cursor: pointer; z-index: 10;">
                <!-- Show Password (Eye) -->
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                </svg>
                <!-- Hide Password (Eye Slash) -->
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                </svg>
              </span>
            </div>
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']" class="text-danger mt-2" style="font-size: 14px;">
              Password is required.
            </div>
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']" class="text-danger mt-2" style="font-size: 14px;">
              Password must be at least 8 characters.
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-4" [disabled]="registerForm.invalid || isLoading">
            Sign Up
          </button>
        </form>

        <div class="text-center mt-4">
          <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background-color: var(--qt-bg-secondary);
    }
    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 2rem;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .w-100 { width: 100%; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  isLoading = false;
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phone: ['', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const data = this.registerForm.value as any;

    this.authService.register(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Registration successful! Please check your email for the verification code.');
        // Pass email to verification screen
        this.router.navigate(['/auth/verify'], { queryParams: { email: data.email } });
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
