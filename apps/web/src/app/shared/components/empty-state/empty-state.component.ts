import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon() }}</div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-3xl) var(--space-lg);
      text-align: center;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: var(--space-md);
    }
    .empty-state h3 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-sm);
    }
    .empty-state p {
      color: var(--color-muted);
      font-size: var(--text-sm);
      max-width: 360px;
    }
  `],
})
export class EmptyStateComponent {
  icon = input('📭');
  title = input('Sin resultados');
  message = input('No se encontraron elementos.');
}
