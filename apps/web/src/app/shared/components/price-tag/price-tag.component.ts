import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-price-tag',
  standalone: true,
  template: `
    <span class="price-tag" [class.free]="isFree()">
      {{ displayPrice() }}
    </span>
  `,
  styles: [`
    .price-tag {
      font-family: var(--font-display);
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--color-ink);
    }
    .price-tag.free {
      color: var(--color-success);
    }
  `],
})
export class PriceTagComponent {
  price = input(0);
  currency = input('EUR');

  isFree = computed(() => this.price() === 0);

  displayPrice(): string {
    if (this.isFree()) return 'Gratis';
    return `${this.price().toFixed(2)}€`;
  }
}
