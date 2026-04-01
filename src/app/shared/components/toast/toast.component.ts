import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts$ | async" 
           class="toast-item" 
           [ngClass]="toast.type">
        <span>{{ toast.message }}</span>
        <button (click)="remove(toast.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast-item {
      min-width: 250px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      animation: slideIn 0.3s ease-out forwards;
    }
    .toast-item.success { background-color: #28a745; }
    .toast-item.error { background-color: #dc3545; }
    .toast-item.info { background-color: #0D1B2A; }
    
    .toast-item button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.8;
    }
    .toast-item button:hover { opacity: 1; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  public toastService = inject(ToastService);

  remove(id: number) {
    this.toastService.remove(id);
  }
}
