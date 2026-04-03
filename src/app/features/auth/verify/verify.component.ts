import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent, SpinnerComponent],
  template: `
    <div class="auth-layout">
      <app-spinner [show]="isLoading"></app-spinner>

      <div class="auth-card card">
        <div class="text-center mb-4">
          <app-logo [height]="50"></app-logo>
          <h2 class="mt-3">Verify your email</h2>
          <p class="text-muted">Enter the 6-digit code sent to {{ email || 'your email' }}</p>
        </div>

        <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">
          <div class="form-group text-center">
            <label class="form-label d-none" for="code">Verification Code</label>
            <input
              id="code"
              type="text"
              class="form-control text-center code-input"
              formControlName="code"
              placeholder="000000"
              maxlength="6">
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-4" [disabled]="verifyForm.invalid || isLoading">
            Verify Code
          </button>
        </form>

        <div class="text-center mt-4">
          <p>Didn't receive a code? <a href="javascript:void(0)" (click)="resendCode()">Resend</a></p>
          <p class="mt-2 text-muted" style="font-size: 14px;"><a routerLink="/auth/login">Back to Login</a></p>
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
    .d-none { display: none; }
    .code-input {
      font-size: 24px;
      letter-spacing: 8px;
    }
  `]
})
export class VerifyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  isLoading = false;
  email = '';

  verifyForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  onSubmit() {
    if (this.verifyForm.invalid || !this.email) {
      if (!this.email) this.toast.error('Email not found. Please log in again.');
      return;
    }

    this.isLoading = true;
    const code = this.verifyForm.value.code!;

    this.authService.verifyEmail({ email: this.email, otp: code }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Email verified successfully! You can now log in.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Verification failed. Invalid code.');
      }
    });
  }

  resendCode() {
    if (!this.email) {
      this.toast.error('Email not found. Cannot resend code.');
      return;
    }
    // In a real app we'd have a resend-code API endpoint. Using forgot-password to trigger code resend if it works,
    // or just inform the user.
    this.toast.success('Code resend functionality will be implemented soon.');
  }
}
