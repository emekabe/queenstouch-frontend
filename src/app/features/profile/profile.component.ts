import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../shared/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent],
  template: `
    <div class="bg-secondary min-vh-100 py-5">
      <app-spinner [show]="isLoading"></app-spinner>
      <div class="container" style="max-width: 600px;">
        <h2 class="mb-4">My Profile</h2>

        <div class="card p-4 border-none shadow-sm mb-4">
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <h4 class="mb-3 text-navy">Personal Details</h4>

            <div class="form-group mb-3">
              <label class="form-label">First Name</label>
              <input type="text" class="form-control" formControlName="firstName" />
            </div>

            <div class="form-group mb-3">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-control" formControlName="lastName" />
            </div>

            <div class="form-group mb-3">
              <label class="form-label">Email Address (Read-only)</label>
              <input type="email" class="form-control" [value]="currentUser?.email" disabled />
            </div>

            <div class="form-group mb-3">
              <label class="form-label">Phone Number</label>
              <input type="tel" class="form-control" formControlName="phone" />
            </div>

            <div class="d-flex justify-content-end">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="profileForm.invalid || isLoading"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div class="card p-4 border-none shadow-sm">
          <h4 class="mb-3 text-navy">Danger Zone</h4>
          <p class="text-muted small">
            Deleting your account is permanent. All your resumes, data, and active orders will be
            wiped immediately.
          </p>
          <div>
            <button class="btn btn-outline-danger" (click)="deleteAccount()">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .min-vh-100 {
        min-height: 100vh;
      }
      .py-5 {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
      .bg-secondary {
        background-color: var(--qt-bg-secondary);
      }
      .shadow-sm {
        box-shadow: var(--box-shadow-sm);
      }
      .border-none {
        border: none;
      }
      .mb-3 {
        margin-bottom: 1rem;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .text-navy {
        color: var(--qt-navy);
      }
      .d-flex {
        display: flex;
      }
      .justify-content-end {
        justify-content: flex-end;
      }
      .btn-outline-danger {
        border: 1px solid var(--qt-danger);
        color: var(--qt-danger);
        background: transparent;
      }
      .btn-outline-danger:hover {
        background: var(--qt-danger);
        color: white;
      }
      .small {
        font-size: 0.875rem;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toast = inject(ToastService);

  isLoading = false;
  currentUser: any = null;

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.currentUser = res.data;
        this.currentUser = res.data;
        this.profileForm.patchValue({
          firstName: this.currentUser.firstName || '',
          lastName: this.currentUser.lastName || '',
          phone: this.currentUser.phone || '',
        });
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load profile.');
      },
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    this.userService
      .updateProfile({
        firstName: this.profileForm.value.firstName || undefined,
        lastName: this.profileForm.value.lastName || undefined,
        phone: this.profileForm.value.phone || undefined,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toast.success('Profile updated successfully!');
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Failed to update profile.');
        },
      });
  }

  deleteAccount() {
    if (
      confirm(
        'Are you absolutely sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      this.toast.error('Account deletion not fully implemented in demo.');
    }
  }
}
