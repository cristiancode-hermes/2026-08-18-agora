import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { EventItem } from '../../../core/models';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/eventos', event().id]" class="card-link">
      @if (variant() === 'musica') {
        <div class="card-musica">
          <img [src]="event().image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'" [alt]="event().title" class="musica-img" />
          <div class="musica-overlay">
            <span class="musica-category">{{ event().category?.name }}</span>
            <h3 class="musica-title">{{ event().title }}</h3>
            <div class="musica-meta">
              <span>{{ formatDate() }}</span>
              <span>{{ formatPrice() }}</span>
            </div>
          </div>
        </div>
      } @else if (variant() === 'talleres') {
        <div class="card-talleres" [style.borderLeftColor]="event().category?.color || 'var(--color-accent)'">
          <div class="talleres-content">
            <span class="badge badge-accent">{{ event().category?.name }}</span>
            <h3 class="talleres-title">{{ event().title }}</h3>
            <p class="talleres-desc">{{ event().description }}</p>
            <div class="talleres-meta">
              <span>{{ formatDate() }}</span>
              <span>{{ formatPrice() }}</span>
            </div>
          </div>
        </div>
      } @else if (variant() === 'gastro') {
        <div class="card-gastro">
          <img [src]="event().image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'" [alt]="event().title" class="gastro-img" />
          <div class="gastro-content">
            <h3 class="gastro-title">{{ event().title }}</h3>
            <div class="gastro-rating">
              <span class="badge badge-primary">{{ event().category?.name }}</span>
            </div>
            <div class="gastro-meta">
              <span>{{ formatDate() }}</span>
              <span class="gastro-price">{{ formatPrice() }}</span>
            </div>
          </div>
        </div>
      } @else if (variant() === 'deportes') {
        <div class="card-deportes">
          <img [src]="event().image || 'https://images.unsplash.com/photo-1461896836934-bd45ba08b6e7?w=600'" [alt]="event().title" class="deportes-img" />
          <div class="deportes-badge badge badge-success">Activo</div>
          <div class="deportes-content">
            <h3 class="deportes-title">{{ event().title }}</h3>
            <div class="deportes-meta">
              <span>{{ formatDate() }}</span>
              <span>{{ formatPrice() }}</span>
            </div>
          </div>
        </div>
      } @else {
        <div class="card-yoga">
          <div class="yoga-content">
            <h3 class="yoga-title">{{ event().title }}</h3>
            <p class="yoga-desc">{{ event().description }}</p>
            <div class="yoga-meta">
              <span>{{ formatDate() }}</span>
              <span>{{ formatPrice() }}</span>
            </div>
          </div>
        </div>
      }

      <div class="card-footer">
        <div class="spots-badge" [class]="'spots-' + spotsLevel()">
          {{ event().spotsAvailable }} plazas disponibles
        </div>
      </div>
    </a>
  `,
  styles: [`
    .card-link {
      display: block;
      text-decoration: none;
      color: inherit;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      overflow: hidden;
      transition: transform var(--transition-base), box-shadow var(--transition-base);
    }
    .card-link:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    .card-musica { position: relative; height: 280px; overflow: hidden; }
    .musica-img { width: 100%; height: 100%; object-fit: cover; }
    .musica-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent 40%, rgba(0,0,0,0.8));
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: var(--space-lg);
      color: #fff;
    }
    .musica-category {
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-secondary);
      margin-bottom: var(--space-xs);
    }
    .musica-title { font-size: var(--text-xl); margin-bottom: var(--space-xs); }
    .musica-meta { display: flex; justify-content: space-between; font-size: var(--text-sm); color: rgba(255,255,255,0.8); }
    .card-talleres { border-left: 4px solid var(--color-accent); }
    .talleres-content { padding: var(--space-lg); }
    .talleres-title { font-size: var(--text-lg); margin: var(--space-sm) 0; }
    .talleres-desc { font-size: var(--text-sm); color: var(--color-muted); margin-bottom: var(--space-md); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .talleres-meta { display: flex; justify-content: space-between; font-size: var(--text-sm); color: var(--color-muted); }
    .gastro-img { width: 100%; height: 180px; object-fit: cover; }
    .gastro-content { padding: var(--space-lg); }
    .gastro-title { font-size: var(--text-lg); margin-bottom: var(--space-sm); }
    .gastro-rating { margin-bottom: var(--space-sm); }
    .gastro-meta { display: flex; justify-content: space-between; font-size: var(--text-sm); color: var(--color-muted); }
    .gastro-price { font-weight: 600; color: var(--color-primary); }
    .card-deportes { position: relative; }
    .deportes-img { width: 100%; height: 200px; object-fit: cover; }
    .deportes-badge { position: absolute; top: var(--space-sm); right: var(--space-sm); }
    .deportes-content { padding: var(--space-lg); }
    .deportes-title { font-size: var(--text-lg); margin-bottom: var(--space-sm); }
    .deportes-meta { display: flex; justify-content: space-between; font-size: var(--text-sm); color: var(--color-muted); }
    .card-yoga { padding: var(--space-xl) var(--space-lg); min-height: 180px; display: flex; align-items: center; }
    .yoga-title { font-size: var(--text-2xl); margin-bottom: var(--space-sm); font-family: var(--font-display); }
    .yoga-desc { font-size: var(--text-sm); color: var(--color-muted); margin-bottom: var(--space-md); }
    .yoga-meta { display: flex; justify-content: space-between; font-size: var(--text-sm); color: var(--color-muted); }
    .card-footer { padding: var(--space-sm) var(--space-lg) var(--space-md); }
    .spots-badge {
      font-size: var(--text-xs);
      font-weight: 600;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      display: inline-block;
    }
    .spots-critical { background: #FEE2E2; color: #DC2626; }
    .spots-scarcity { background: #FEF3C7; color: #D97706; }
    .spots-available { background: #DCFCE7; color: #16A34A; }
    .spots-soldout { background: var(--color-border); color: var(--color-muted); }
  `],
})
export class EventCardComponent {
  event = input.required<EventItem>();
  categorySlug = input('');

  variant = computed(() => {
    const slug = this.categorySlug() || this.event()?.category?.slug || '';
    const map: Record<string, string> = {
      musica: 'musica',
      talleres: 'talleres',
      gastronomia: 'gastro',
      deportes: 'deportes',
      yoga: 'yoga',
    };
    return map[slug] || 'gastro';
  });

  spotsLevel = computed(() => {
    const available = this.event()?.spotsAvailable ?? 0;
    if (available <= 0) return 'soldout';
    if (available <= 5) return 'critical';
    if (available <= 15) return 'scarcity';
    return 'available';
  });

  formatDate(): string {
    const d = this.event()?.date;
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  }

  formatPrice(): string {
    const price = this.event()?.price;
    if (price === 0 || price === undefined) return 'Gratis';
    return `${price}€`;
  }
}
