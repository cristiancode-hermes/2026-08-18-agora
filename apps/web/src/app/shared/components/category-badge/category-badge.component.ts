import { Component, input } from '@angular/core';

@Component({
  selector: 'app-category-badge',
  standalone: true,
  template: `
    <span class="category-badge" [style.backgroundColor]="bgColor()" [style.color]="textColor()">
      {{ label() }}
    </span>
  `,
  styles: [`
    .category-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      white-space: nowrap;
    }
  `],
})
export class CategoryBadgeComponent {
  label = input('');
  color = input('');

  bgColor(): string {
    const c = this.color();
    return c ? `${c}20` : 'rgba(45, 90, 61, 0.12)';
  }

  textColor(): string {
    return this.color() || 'var(--color-primary)';
  }
}
