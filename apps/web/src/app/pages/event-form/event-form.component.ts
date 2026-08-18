import { Component, signal, computed, inject, OnInit } from '@angular/core';
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
  selector: 'app-event-form',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ToastComponent],
  template: `<app-navbar />
<div class="page-container">
  <h1>{{ isEditing() ? 'Editar evento' : 'Crear evento' }}</h1>
  <form class="event-form" (submit)="saveEvent($event)">
    <div class="form-group"><label>Título</label><input type="text" [value]="title()" (input)="title.set($any($event.target).value)" required /></div>
    <div class="form-group"><label>Descripción</label><textarea [value]="description()" (input)="description.set($any($event.target).value)" required></textarea></div>
    <div class="form-row">
      <div class="form-group"><label>Fecha</label><input type="date" [value]="date()" (input)="date.set($any($event.target).value)" required /></div>
      <div class="form-group"><label>Hora</label><input type="time" [value]="time()" (input)="time.set($any($event.target).value)" required /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Duración (min)</label><input type="number" [value]="durationMin()" (input)="durationMin.set(+$any($event.target).value)" /></div>
      <div class="form-group"><label>Precio (€)</label><input type="number" [value]="price()" (input)="price.set(+$any($event.target).value)" /></div>
      <div class="form-group"><label>Aforo</label><input type="number" [value]="capacity()" (input)="capacity.set(+$any($event.target).value)" required /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Categoría</label><select [value]="categoryId()" (change)="categoryId.set(+$any($event.target).value)">
        @for (cat of categories(); track cat.id) {
          <option [value]="cat.id">{{ cat.name }}</option>
        }
      </select></div>
      <div class="form-group"><label>Lugar</label><select [value]="venueId()" (change)="venueId.set(+$any($event.target).value)">
        @for (v of venues(); track v.id) {
          <option [value]="v.id">{{ v.name }}</option>
        }
      </select></div>
    </div>
    <div class="form-group"><label>URL de imagen</label><input type="url" [value]="imageUrl()" (input)="imageUrl.set($any($event.target).value)" /></div>
    <button type="submit" class="btn-primary">{{ isEditing() ? 'Guardar cambios' : 'Crear evento' }}</button>
  </form>
</div>
<app-footer />`
})
export default class EventFormComponent implements OnInit {
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
