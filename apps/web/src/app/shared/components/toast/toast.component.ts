import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (n of notif.notifications(); track n.id) {
        <div class="toast-item" [class]="'toast-' + n.type" role="alert">
          <span class="toast-icon">
            @switch (n.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @default { ℹ }
            }
          </span>
          <span class="toast-message">{{ n.message }}</span>
          <button class="toast-close" (click)="notif.dismiss(n.id)" aria-label="Cerrar">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 16px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      max-width: 400px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 12px 16px;
      border-radius: var(--radius-md);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast-item { animation: none; }
    }
    .toast-icon { font-weight: 700; font-size: var(--text-lg); flex-shrink: 0; }
    .toast-message { flex: 1; font-size: var(--text-sm); }
    .toast-close {
      background: none;
      border: none;
      font-size: var(--text-lg);
      cursor: pointer;
      color: var(--color-muted);
      padding: 0;
      line-height: 1;
    }
    .toast-success .toast-icon { color: var(--color-success); }
    .toast-success { border-left: 4px solid var(--color-success); }
    .toast-error .toast-icon { color: var(--color-danger); }
    .toast-error { border-left: 4px solid var(--color-danger); }
    .toast-warning .toast-icon { color: var(--color-warning); }
    .toast-warning { border-left: 4px solid var(--color-warning); }
    .toast-info .toast-icon { color: var(--color-primary); }
    .toast-info { border-left: 4px solid var(--color-primary); }
  `],
})
export class ToastComponent {
  notif = inject(NotificationService);
}
