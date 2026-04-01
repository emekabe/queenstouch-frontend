import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-2">
      <h3 class="mb-4 text-navy">Overview</h3>
      
      <!-- Stats Row -->
      <div class="stats-grid mb-5">
        
        <div class="card p-4 shadow-sm border-none bg-white rounded">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="text-muted m-0">Total Users</h6>
            <span class="icon text-primary rounded-circle p-2 bg-secondary">👥</span>
          </div>
          <h2 class="m-0">1,245</h2>
          <small class="text-success mt-2">+12% from last month</small>
        </div>
        
        <div class="card p-4 shadow-sm border-none bg-white rounded">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="text-muted m-0">Active Orders</h6>
            <span class="icon text-primary rounded-circle p-2 bg-secondary">🛍️</span>
          </div>
          <h2 class="m-0">48</h2>
          <small class="text-success mt-2">+5% from last month</small>
        </div>
        
        <div class="card p-4 shadow-sm border-none bg-white rounded">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="text-muted m-0">Premium Requests</h6>
            <span class="icon text-primary rounded-circle p-2 bg-secondary">⭐</span>
          </div>
          <h2 class="m-0">12</h2>
          <small class="text-warning mt-2">5 pending review</small>
        </div>
        
        <div class="card p-4 shadow-sm border-none bg-white rounded">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="text-muted m-0">Revenue (Monthly)</h6>
            <span class="icon text-primary rounded-circle p-2 bg-secondary">💰</span>
          </div>
          <h2 class="m-0">₦450k</h2>
          <small class="text-success mt-2">+18% from last month</small>
        </div>
        
      </div>
      
      <!-- Recent Activity -->
      <div class="card p-4 shadow-sm border-none bg-white rounded">
        <h5 class="mb-4">Recent Activity</h5>
        
        <div class="activity-list border border-secondary rounded p-3">
          <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
              <span class="fw-500">New Order</span>
              <p class="small text-muted m-0">User john@example.com purchased CV Review</p>
            </div>
            <span class="small text-muted">2 mins ago</span>
          </div>
          <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
              <span class="fw-500">Premium Request</span>
              <p class="small text-muted m-0">Sarah submitted a new Premium Overhaul request</p>
            </div>
            <span class="small text-muted">1 hour ago</span>
          </div>
          <div class="d-flex justify-content-between align-items-center py-2">
            <div>
              <span class="fw-500">New User Registration</span>
              <p class="small text-muted m-0">Mike T. created an account</p>
            </div>
            <span class="small text-muted">3 hours ago</span>
          </div>
        </div>
        
      </div>
      
    </div>
  `,
  styles: [`
    .text-navy { color: var(--qt-navy); }
    .text-success { color: var(--qt-success); }
    .text-warning { color: var(--qt-warning); }
    .bg-white { background-color: #fff; }
    .bg-secondary { background-color: var(--qt-bg-secondary); }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    
    .shadow-sm { box-shadow: var(--box-shadow-sm); }
    .border-none { border: none; }
    .border { border: 1px solid var(--border-color); }
    .border-bottom { border-bottom: 1px solid var(--border-color); }
    .rounded { border-radius: 8px; }
    
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    
    .m-0 { margin: 0; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mb-5 { margin-bottom: 3rem; }
    .mt-2 { margin-top: 0.5rem; }
    
    .p-2 { padding: 0.5rem; }
    .p-3 { padding: 1rem; }
    .p-4 { padding: 1.5rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    
    .fw-500 { font-weight: 500; }
    .small { font-size: 0.875rem; }
  `]
})
export class AdminDashboardComponent {}
