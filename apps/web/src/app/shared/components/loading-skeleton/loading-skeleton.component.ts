import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    @for (item of skeletonItems; track item) {
      <div class="skeleton" [style.width]="width()" [style.height]="height()" [style.borderRadius]="rounded() ? '50%' : 'var(--radius-md)'"></div>
    }
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(90deg, var(--color-border) 25%, var(--color-background) 50%, var(--color-border) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .skeleton { animation: none; }
    }
  `],
})
export class LoadingSkeletonComponent {
  count = input(1);
  width = input('100%');
  height = input('20px');
  rounded = input(false);

  get skeletonItems(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }
}
