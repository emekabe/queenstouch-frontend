import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent, SpinnerComponent],
  template: `
    <div class="auth-layout">
      <app-spinner [show]="isLoading"></app-spinner>
      
      <div class="auth-card card">
        <div class="text-center mb-4">
          <app-logo [height]="50"></app-logo>
          <h2 class="mt-3">Welcome Back</h2>
          <p class="text-muted">Sign in to your account to continue</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              class="form-control" 
              formControlName="email" 
              placeholder="Enter your email">
            <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-danger mt-2" style="font-size: 14px;">
              Please enter a valid email address.
            </div>
          </div>

          <div class="form-group">
            <div class="d-flex justify-content-between">
              <label class="form-label" for="password">Password</label>
              <a routerLink="/auth/forgot-password" style="font-size: 14px;">Forgot Password?</a>
            </div>
            <input 
              id="password" 
              type="password" 
              class="form-control" 
              formControlName="password" 
              placeholder="Enter your password">
            <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-danger mt-2" style="font-size: 14px;">
              Password is required.
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-4" [disabled]="loginForm.invalid || isLoading">
            Sign In
          </button>
        </form>

        <div class="text-center mt-4">
          <p>Don't have an account? <a routerLink="/auth/register">Sign Up</a></p>
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
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toast.success('Logged in successfully!');
        if (res.data?.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }
}
