import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="status-badge" [class]="'status-' + variant()">
      {{ label() }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
    }
    .status-confirmed { background: rgba(22, 163, 74, 0.12); color: #16A34A; }
    .status-cancelled { background: rgba(220, 38, 38, 0.12); color: #DC2626; }
    .status-checked_in { background: rgba(45, 90, 61, 0.12); color: var(--color-primary); }
    .status-draft { background: rgba(107, 114, 128, 0.12); color: #6B7280; }
    .status-published { background: rgba(22, 163, 74, 0.12); color: #16A34A; }
    .status-completed { background: rgba(107, 114, 128, 0.12); color: #6B7280; }
  `],
})
export class StatusBadgeComponent {
  status = input('');
  label = input('');

  variant = computed(() => this.status());
}
