import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../core/services/events.service';
import { CategoriesService } from '../../core/services/categories.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import type { EventItem, Category } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, NavbarComponent, FooterComponent, EventCardComponent, ToastComponent],
  template: `
    <app-toast />
    <app-navbar />
    <main>
      <!-- Hero -->
      <section class="hero">
        <div class="container hero-inner">
          <div class="hero-content">
            <h1 class="hero-title">Experiencias que<br/><span class="hero-highlight">conectan personas</span></h1>
            <p class="hero-subtitle">Descubre eventos únicos en tu comunidad. Música, talleres, gastronomía, deporte y más.</p>
            <div class="hero-search">
              <input
                type="text"
                class="hero-input"
                placeholder="¿Qué estás buscando?"
                [(ngModel)]="searchQuery"
                (keyup.enter)="doSearch()"
              />
              <button class="btn btn-primary btn-lg" (click)="doSearch()">Buscar</button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-shape"></div>
            <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600" alt="Personas en un evento" class="hero-img" />
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="section container">
        <h2 class="section-title">Explora por categoría</h2>
        <div class="categories-bar">
          @for (cat of categories(); track cat.id) {
            <button class="category-pill" (click)="filterByCategory(cat.slug)" [class.active]="selectedCategory() === cat.slug">
              {{ cat.name }}
            </button>
          }
        </div>
      </section>

      <!-- Featured Events -->
      <section class="section container">
        <div class="section-header">
          <h2 class="section-title">Eventos destacados</h2>
          <a routerLink="/eventos" class="section-link">Ver todos →</a>
        </div>
        @if (loading()) {
          <div class="grid grid-3 gap-lg">
            @for (i of skeletonItems; track i) {
              <div class="skeleton-card">
                <div class="skel-img"></div>
                <div class="skel-text"></div>
                <div class="skel-text short"></div>
              </div>
            }
          </div>
        } @else if (featured().length === 0) {
          <div class="empty-msg">No hay eventos destacados en este momento.</div>
        } @else {
          <div class="grid grid-3 gap-lg">
            @for (evt of featured(); track evt.id) {
              <app-event-card [event]="evt" [categorySlug]="evt.category?.slug || ''" />
            }
          </div>
        }
      </section>

      <!-- CTA -->
      <section class="cta-section container">
        <div class="cta-card">
          <h2>¿Tienes un evento que compartir?</h2>
          <p>Crea tu evento y llega a cientos de personas en tu comunidad.</p>
          <a routerLink="/organizador" class="btn btn-secondary btn-lg">Crear Evento</a>
        </div>
      </section>
    </main>
    <app-footer />
  `,
  styles: [`
    .hero {
      padding: var(--space-3xl) 0;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .hero-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-2xl);
      align-items: center;
    }
    .hero-title {
      font-family: var(--font-display);
      font-size: var(--text-5xl);
      line-height: 1.1;
      margin-bottom: var(--space-lg);
    }
    .hero-highlight {
      color: var(--color-primary);
    }
    .hero-subtitle {
      font-size: var(--text-lg);
      color: var(--color-muted);
      margin-bottom: var(--space-xl);
      max-width: 480px;
    }
    .hero-search {
      display: flex;
      gap: var(--space-sm);
      max-width: 480px;
    }
    .hero-input {
      flex: 1;
      padding: 14px 18px;
      font-size: var(--text-base);
      font-family: var(--font-body);
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background);
      color: var(--color-ink);
      outline: none;
    }
    .hero-input:focus {
      border-color: var(--color-primary);
    }
    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .hero-img {
      width: 100%;
      max-width: 480px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      position: relative;
      z-index: 1;
    }
    .hero-shape {
      position: absolute;
      width: 300px;
      height: 300px;
      background: var(--color-primary);
      opacity: 0.15;
      border-radius: 50%;
      z-index: 0;
    }
    .section {
      padding: var(--space-3xl) 0;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }
    .section-title {
      font-size: var(--text-3xl);
      margin-bottom: var(--space-lg);
    }
    .section-header .section-title {
      margin-bottom: 0;
    }
    .section-link {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-primary);
    }
    .categories-bar {
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
      margin-bottom: var(--space-lg);
    }
    .category-pill {
      padding: 8px 18px;
      border-radius: var(--radius-full);
      border: 1.5px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-muted);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      font-family: var(--font-body);
    }
    .category-pill:hover,
    .category-pill.active {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: rgba(45, 90, 61, 0.08);
    }
    .dark .category-pill:hover,
    .dark .category-pill.active {
      background: rgba(74, 157, 106, 0.15);
    }
    .skeleton-card {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }
    .skel-img {
      height: 200px;
      background: linear-gradient(90deg, var(--color-border) 25%, var(--color-background) 50%, var(--color-border) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .skel-text {
      height: 16px;
      margin: var(--space-md);
      background: var(--color-border);
      border-radius: 4px;
      width: 80%;
    }
    .skel-text.short { width: 50%; margin-top: 0; }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .skel-img { animation: none; }
    }
    .empty-msg {
      text-align: center;
      padding: var(--space-2xl);
      color: var(--color-muted);
    }
    .cta-section {
      padding: var(--space-2xl) 0 var(--space-3xl);
    }
    .cta-card {
      background: linear-gradient(135deg, var(--color-primary), #3a7a52);
      color: #fff;
      padding: var(--space-2xl) var(--space-3xl);
      border-radius: var(--radius-lg);
      text-align: center;
    }
    .cta-card h2 {
      color: #fff;
      font-size: var(--text-3xl);
      margin-bottom: var(--space-md);
    }
    .cta-card p {
      opacity: 0.9;
      margin-bottom: var(--space-lg);
      font-size: var(--text-lg);
    }
    @media (max-width: 768px) {
      .hero-inner { grid-template-columns: 1fr; }
      .hero-visual { display: none; }
      .hero-title { font-size: var(--text-3xl); }
    }
  `],
})
export default class HomeComponent implements OnInit {
  private eventsService = inject(EventsService);
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);

  searchQuery = '';
  selectedCategory = signal('');
  categories = signal<Category[]>([]);
  featured = signal<EventItem[]>([]);
  loading = signal(true);
  skeletonItems = [0, 1, 2];

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeatured();
  }

  loadCategories(): void {
    this.categoriesService.list().subscribe({
      next: (res) => this.categories.set(res.categories),
      error: () => {},
    });
  }

  loadFeatured(): void {
    this.loading.set(true);
    this.eventsService.featured().subscribe({
      next: (res) => {
        this.featured.set(res.events);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  filterByCategory(slug: string): void {
    this.selectedCategory.set(slug);
    this.router.navigate(['/eventos'], { queryParams: { category: slug } });
  }

  doSearch(): void {
    const params: Record<string, string> = {};
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.selectedCategory()) params['category'] = this.selectedCategory();
    this.router.navigate(['/eventos'], { queryParams: params });
  }
}
