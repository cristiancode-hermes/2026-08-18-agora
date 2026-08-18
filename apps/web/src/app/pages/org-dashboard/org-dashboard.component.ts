import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-org-dashboard',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  template: `<app-navbar />
<div class="page-container">
  <h1>Dashboard del Organizador</h1>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-value">{{ stats()?.totalEvents }}</div><div class="stat-label">Eventos</div></div>
    <div class="stat-card"><div class="stat-value">{{ stats()?.totalBookings }}</div><div class="stat-label">Reservas</div></div>
    <div class="stat-card"><div class="stat-value">€{{ stats()?.totalRevenue }}</div><div class="stat-label">Ingresos</div></div>
    <div class="stat-card"><div class="stat-value">{{ stats()?.avgOccupancy }}%</div><div class="stat-label">Ocupación</div></div>
  </div>
  <div class="chart-section">
    <h2>Reservas por día</h2>
    <svg class="bar-chart" viewBox="0 0 800 200" *ngIf="chartData().length > 0">
      <g *ngFor="let bar of chartData(); let i = index">
        <rect [attr.x]="i * 30 + 10" [attr.y]="200 - bar.height" width="24" [attr.height]="bar.height" fill="var(--color-primary)" rx="3"/>
        <text [attr.x]="i * 30 + 22" [attr.y]="200 - bar.height - 5" text-anchor="middle" font-size="10" fill="var(--color-muted)">{{ bar.count }}</text>
        <text [attr.x]="i * 30 + 22" [attr.y]="195" text-anchor="middle" font-size="8" fill="var(--color-muted)">{{ bar.label }}</text>
      </g>
    </svg>
  </div>
  <div class="events-table">
    <h2>Mis eventos</h2>
    <table>
      <thead><tr><th>Evento</th><th>Fecha</th><th>Plazas</th><th>Ingresos</th><th>Acciones</th></tr></thead>
      <tbody>
        <tr *ngFor="let ev of stats()?.events">
          <td>{{ ev.title }}</td>
          <td>{{ ev.date }}</td>
          <td>{{ ev.spotsTaken }}/{{ ev.capacity }}</td>
          <td>€{{ ev.revenue }}</td>
          <td><a [routerLink]="['/organizador', ev.id, 'asistentes']" class="btn-sm">Gestionar</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<app-footer />`
})
export default class OrgDashboardComponent implements OnInit {
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
