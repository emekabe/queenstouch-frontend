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
          
          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <input id="name" type="text" class="form-control" formControlName="name" placeholder="Enter your full name">
            <div *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.invalid" class="text-danger mt-2" style="font-size: 14px;">
              Name is required.
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
            <label class="form-label" for="phoneNumber">Phone Number (Optional)</label>
            <input id="phoneNumber" type="tel" class="form-control" formControlName="phoneNumber" placeholder="Enter your phone number">
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input id="password" type="password" class="form-control" formControlName="password" placeholder="Create a strong password">
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
    .w-100 { width: 100%; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  isLoading = false;

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phoneNumber: ['']
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
