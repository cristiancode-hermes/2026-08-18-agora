import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../core/services/events.service';
import { CategoriesService } from '../../core/services/categories.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import type { EventItem, Category } from '../../core/models';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent, FooterComponent, EventCardComponent, ToastComponent],
  template: `
    <app-toast />
    <app-navbar />
    <main class="container catalogue">
      <h1>Explora Eventos</h1>

      <!-- Filters -->
      <div class="filters-bar">
        <input
          type="text"
          class="form-input search-input"
          placeholder="Buscar eventos..."
          [(ngModel)]="searchQuery"
          (keyup.enter)="applyFilters()"
        />
        <select class="form-select" [(ngModel)]="selectedCategory" (change)="applyFilters()">
          <option value="">Todas las categorías</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.slug">{{ cat.name }}</option>
          }
        </select>
        <input
          type="date"
          class="form-input"
          [(ngModel)]="selectedDate"
          (change)="applyFilters()"
        />
        <div class="price-filter">
          <input
            type="number"
            class="form-input price-input"
            placeholder="Mín €"
            [(ngModel)]="minPrice"
            min="0"
          />
          <span class="price-sep">—</span>
          <input
            type="number"
            class="form-input price-input"
            placeholder="Máx €"
            [(ngModel)]="maxPrice"
            min="0"
          />
          <button class="btn btn-outline btn-sm" (click)="applyFilters()">Filtrar</button>
        </div>
      </div>

      <!-- Results -->
      @if (loading()) {
        <div class="grid grid-3 gap-lg mt-lg">
          @for (i of skeletonItems; track i) {
            <div class="skeleton-card">
              <div class="skel-img"></div>
              <div class="skel-text"></div>
              <div class="skel-text short"></div>
            </div>
          }
        </div>
      } @else if (events().length === 0) {
        <div class="empty-msg">
          <span style="font-size: 3rem;">🔍</span>
          <p>No se encontraron eventos con esos filtros.</p>
        </div>
      } @else {
        <div class="results-info">
          <span>{{ total() }} eventos encontrados</span>
        </div>
        <div class="grid grid-3 gap-lg">
          @for (evt of events(); track evt.id) {
            <app-event-card [event]="evt" [categorySlug]="evt.category?.slug || ''" />
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="pagination">
            <button class="btn btn-ghost btn-sm" [disabled]="currentPage() <= 1" (click)="goToPage(currentPage() - 1)">← Anterior</button>
            <span class="page-info">Página {{ currentPage() }} de {{ totalPages() }}</span>
            <button class="btn btn-ghost btn-sm" [disabled]="currentPage() >= totalPages()" (click)="goToPage(currentPage() + 1)">Siguiente →</button>
          </div>
        }
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .catalogue { padding: var(--space-xl) var(--space-md); }
    .catalogue h1 {
      font-size: var(--text-3xl);
      margin-bottom: var(--space-xl);
    }
    .filters-bar {
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
      align-items: center;
      padding: var(--space-lg);
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      margin-bottom: var(--space-xl);
    }
    .search-input { max-width: 280px; }
    .form-select {
      min-width: 180px;
    }
    .price-filter {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }
    .price-input {
      width: 90px;
    }
    .price-sep {
      color: var(--color-muted);
    }
    .results-info {
      font-size: var(--text-sm);
      color: var(--color-muted);
      margin-bottom: var(--space-lg);
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      margin-top: var(--space-xl);
      padding: var(--space-lg) 0;
    }
    .page-info {
      font-size: var(--text-sm);
      color: var(--color-muted);
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
      padding: var(--space-3xl);
      color: var(--color-muted);
    }
    .empty-msg p { margin-top: var(--space-md); }
  `],
})
export default class CatalogueComponent implements OnInit {
  private eventsService = inject(EventsService);
  private categoriesService = inject(CategoriesService);
  private route = inject(ActivatedRoute);

  searchQuery = '';
  selectedCategory = '';
  selectedDate = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  events = signal<EventItem[]>([]);
  categories = signal<Category[]>([]);
  total = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  loading = signal(true);
  skeletonItems = [0, 1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.categoriesService.list().subscribe({
      next: (res) => this.categories.set(res.categories),
    });

    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.selectedDate = params['date'] || '';
      this.loadEvents();
    });
  }

  loadEvents(): void {
    this.loading.set(true);
    const params: Record<string, string | number> = {
      page: this.currentPage(),
      limit: 9,
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.selectedCategory) params['category'] = this.selectedCategory;
    if (this.selectedDate) params['date'] = this.selectedDate;
    if (this.minPrice !== null) params['minPrice'] = this.minPrice;
    if (this.maxPrice !== null) params['maxPrice'] = this.maxPrice;

    this.eventsService.list(params as any).subscribe({
      next: (res) => {
        this.events.set(res.events);
        this.total.set(res.total);
        this.totalPages.set(res.pages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadEvents();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
