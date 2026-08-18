import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { CategoryBadgeComponent } from '../../shared/components/category-badge/category-badge.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AuthService } from '../../core/services/auth.service';
import { EventsService } from '../../core/services/events.service';
import { BookingsService } from '../../core/services/bookings.service';
import { ReviewsService } from '../../core/services/reviews.service';
import { StatsService } from '../../core/services/stats.service';
import { VenuesService } from '../../core/services/venues.service';
import { CategoriesService } from '../../core/services/categories.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, NavbarComponent, FooterComponent, CategoryBadgeComponent, LoadingSkeletonComponent, ToastComponent],
  template: `<app-navbar />
<div class="page-container" *ngIf="!loading() && event()">
  <a routerLink="/eventos" class="back-link">← Volver a eventos</a>
  <div class="event-detail">
    <div class="event-gallery">
      <img [src]="event()!.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'" [alt]="event()!.title" />
    </div>
    <div class="event-content">
      <div class="event-meta-row">
        <app-category-badge [label]="event()!.category?.name || ''" [color]="event()!.category?.color || ''" />
        <span class="rating" *ngIf="event()!.avgRating">★ {{ event()!.avgRating }} ({{ event()!.reviewCount }} reseñas)</span>
      </div>
      <h1>{{ event()!.title }}</h1>
      <div class="event-info-grid">
        <div class="event-info">
          <p>📅 {{ event()!.date }} · {{ event()!.time }}</p>
          <p>⏱️ {{ event()!.durationMin }} min</p>
          <p>📍 {{ event()!.venue?.name }}, {{ event()!.venue?.address }}</p>
          <p>🎤 Organizado por: {{ event()!.organizer?.username }}</p>
        </div>
        <div class="booking-widget" *ngIf="!userBooking()">
          <div class="price">€{{ event()!.price }}</div>
          <div class="spots-badge" [class]="'spots-' + spotsColor()">{{ spotsLabel() }}</div>
          <div class="quantity-selector" *ngIf="spotsAvailable() > 0">
            <button (click)="decrementQty()" [disabled]="quantity() <= 1">−</button>
            <span>{{ quantity() }}</span>
            <button (click)="incrementQty()" [disabled]="quantity() >= 4 || quantity() >= spotsAvailable()">+</button>
          </div>
          <div class="total" *ngIf="spotsAvailable() > 0">Total: €{{ event()!.price * quantity() }}</div>
          <button class="btn-primary" (click)="bookEvent()" [disabled]="spotsAvailable() <= 0 || booking()">
            {{ booking() ? 'Reservando...' : 'Reservar mi plaza' }}
          </button>
        </div>
        <div class="booking-widget booked" *ngIf="userBooking()">
          <p class="booked-msg">✅ Ya tienes una reserva</p>
          <a [routerLink]="['/mis-eventos', userBooking()!.id, 'ticket']" class="btn-secondary">Ver ticket</a>
        </div>
      </div>
      <div class="event-description">
        <h2>Descripción</h2>
        <p>{{ event()!.description }}</p>
      </div>
      <div class="event-map" *ngIf="event()!.venue?.lat && event()!.venue?.lng">
        <h2>Ubicación</h2>
        <div class="map-placeholder" style="background:var(--color-background);border-radius:10px;height:300px;display:flex;align-items:center;justify-content:center;color:var(--color-muted)"><p>📍 {{ event()!.venue?.address }}</p></div>
      </div>
      <div class="event-reviews">
        <h2>Reseñas ({{ reviews().length }})</h2>
        <div class="review-item" *ngFor="let review of reviews()">
          <div class="review-stars">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</div>
          <p class="review-comment">{{ review.comment }}</p>
          <span class="review-author">{{ review.user?.username }} · {{ review.createdAt | date:'mediumDate' }}</span>
        </div>
        <a *ngIf="canReview()" [routerLink]="['/eventos', event()!.id, 'review']" class="btn-secondary">Dejar reseña</a>
      </div>
    </div>
  </div>
</div>
<app-loading-skeleton *ngIf="loading()" variant="detail" />
<app-footer />`
})
export default class EventDetailComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Signals for data
  event = signal<any>(null);
  events = signal<any[]>([]);
  bookings = signal<any[]>([]);
  reviews = signal<any[]>([]);
  stats = signal<any>(null);
  categories = signal<any[]>([]);
  venues = signal<any[]>([]);
  ticket = signal<any>(null);
  userBooking = signal<any>(null);
  
  // Form signals
  title = signal('');
  description = signal('');
  date = signal('');
  time = signal('');
  durationMin = signal(60);
  price = signal(0);
  capacity = signal(0);
  categoryId = signal(0);
  venueId = signal(0);
  imageUrl = signal('');
  rating = signal(0);
  comment = signal('');
  quantity = signal(1);
  booking = signal(false);
  submitting = signal(false);
  isEditing = signal(false);
  filter = signal<'all' | 'upcoming' | 'past'>('all');
  
  // Computed
  spotsAvailable = computed(() => {
    const e = this.event();
    if (!e) return 0;
    return e.capacity - (e.spotsTaken || 0);
  });
  spotsColor = computed(() => {
    const n = this.spotsAvailable();
    if (n === 0) return 'danger';
    if (n <= 5) return 'warning';
    return 'success';
  });
  spotsLabel = computed(() => {
    const n = this.spotsAvailable();
    if (n === 0) return 'Agotado';
    if (n <= 5) return `¡Solo ${n} plazas!`;
    return `${n} plazas disponibles`;
  });
  filteredBookings = signal<any[]>([]);
  upcomingCount = signal(0);
  pastCount = signal(0);
  allBookings = signal<any[]>([]);
  canReview = signal(false);
  mapUrl = signal('');
  chartData = signal<any[]>([]);
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventsService = inject(EventsService);
  private bookingsService = inject(BookingsService);
  private reviewsService = inject(ReviewsService);
  private statsService = inject(StatsService);
  private venuesService = inject(VenuesService);
  private categoriesService = inject(CategoriesService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  
  ngOnInit() {
    this.loadData();
  }
  
  async loadData() {
    this.loading.set(true);
    try {
      // Override in specific page implementations
    } catch (e: any) {
      this.error.set(e.message || 'Error loading data');
    } finally {
      this.loading.set(false);
    }
  }
  
  async bookEvent() {}
  cancelBooking(b: any) {}
  incrementQty() { if (this.quantity() < 4) this.quantity.set(this.quantity() + 1); }
  decrementQty() { if (this.quantity() > 1) this.quantity.set(this.quantity() - 1); }
  async saveEvent(e: Event) { e.preventDefault(); }
  async checkin(b: any) {}
  async toggleStatus(ev: any) {}
  async submitReview() {}
  async deleteReview(r: any) {}
}
