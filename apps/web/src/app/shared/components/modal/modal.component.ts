import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="modal-backdrop" (click)="close.emit()">
        <div class="modal-content" (click)="$event.stopPropagation()" role="dialog" [attr.aria-label]="title()">
          <div class="modal-header">
            <h3>{{ title() }}</h3>
            <button class="modal-close" (click)="close.emit()" aria-label="Cerrar">×</button>
          </div>
          <div class="modal-body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: var(--space-lg);
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-content {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: var(--shadow-xl);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }
    .modal-header h3 { margin: 0; font-size: var(--text-lg); }
    .modal-close {
      background: none;
      border: none;
      font-size: var(--text-2xl);
      cursor: pointer;
      color: var(--color-muted);
      line-height: 1;
    }
    .modal-body { padding: var(--space-lg); }
  `],
})
export class ModalComponent {
  open = input(false);
  title = input('');
  close = output();
}
