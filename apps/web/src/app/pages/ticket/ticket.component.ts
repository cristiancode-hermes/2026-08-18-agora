import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingsService } from '../../core/services/bookings.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import type { Booking, Ticket } from '../../core/models';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [RouterLink, NavbarComponent, ToastComponent],
  template: `
    <app-toast />
    <app-navbar />
    <main class="ticket-page container">
      @if (loading()) {
        <div class="ticket-loading">
          <div class="skel-block"></div>
        </div>
      } @else if (booking()) {
        <div class="ticket-wrapper">
          <div class="ticket">
            <div class="ticket-left">
              <div class="ticket-brand">Agora</div>
              <h2>{{ booking()!.event?.title }}</h2>
              <div class="ticket-details">
                <div class="ticket-row">
                  <span class="ticket-label">Fecha</span>
                  <span class="ticket-value">{{ formatDate() }}</span>
                </div>
                <div class="ticket-row">
                  <span class="ticket-label">Hora</span>
                  <span class="ticket-value">{{ booking()!.event?.time }}</span>
                </div>
                <div class="ticket-row">
                  <span class="ticket-label">Lugar</span>
                  <span class="ticket-value">{{ booking()!.event?.venue?.name }}</span>
                </div>
                <div class="ticket-row">
                  <span class="ticket-label">Plazas</span>
                  <span class="ticket-value">{{ booking()!.spotsCount }}</span>
                </div>
                <div class="ticket-row">
                  <span class="ticket-label">Estado</span>
                  <span class="ticket-value status-text">{{ booking()!.status }}</span>
                </div>
                @if (ticket()) {
                  <div class="ticket-row">
                    <span class="ticket-label">Código</span>
                    <span class="ticket-value mono">{{ ticket()!.code }}</span>
                  </div>
                }
              </div>
            </div>
            <div class="ticket-divider">
              <div class="notch top"></div>
              <div class="dashed-line"></div>
              <div class="notch bottom"></div>
            </div>
            <div class="ticket-right">
              <!-- QR Code SVG -->
              <div class="qr-code">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="120" fill="white" rx="8"/>
                  <!-- QR-like pattern -->
                  <g fill="#1A1A1A">
                    <!-- Top-left finder -->
                    <rect x="10" y="10" width="30" height="30" rx="4"/>
                    <rect x="14" y="14" width="22" height="22" rx="2" fill="white"/>
                    <rect x="18" y="18" width="14" height="14" rx="2"/>
                    <!-- Top-right finder -->
                    <rect x="80" y="10" width="30" height="30" rx="4"/>
                    <rect x="84" y="14" width="22" height="22" rx="2" fill="white"/>
                    <rect x="88" y="18" width="14" height="14" rx="2"/>
                    <!-- Bottom-left finder -->
                    <rect x="10" y="80" width="30" height="30" rx="4"/>
                    <rect x="14" y="84" width="22" height="22" rx="2" fill="white"/>
                    <rect x="18" y="88" width="14" height="14" rx="2"/>
                    <!-- Data pattern -->
                    <rect x="48" y="10" width="8" height="8" rx="1"/>
                    <rect x="60" y="10" width="8" height="8" rx="1"/>
                    <rect x="48" y="22" width="8" height="8" rx="1"/>
                    <rect x="10" y="48" width="8" height="8" rx="1"/>
                    <rect x="22" y="48" width="8" height="8" rx="1"/>
                    <rect x="48" y="48" width="8" height="8" rx="1"/>
                    <rect x="60" y="48" width="8" height="8" rx="1"/>
                    <rect x="80" y="48" width="8" height="8" rx="1"/>
                    <rect x="100" y="48" width="8" height="8" rx="1"/>
                    <rect x="48" y="60" width="8" height="8" rx="1"/>
                    <rect x="60" y="60" width="8" height="8" rx="1"/>
                    <rect x="80" y="60" width="8" height="8" rx="1"/>
                    <rect x="48" y="80" width="8" height="8" rx="1"/>
                    <rect x="60" y="80" width="8" height="8" rx="1"/>
                    <rect x="80" y="80" width="8" height="8" rx="1"/>
                    <rect x="100" y="80" width="8" height="8" rx="1"/>
                    <rect x="80" y="100" width="8" height="8" rx="1"/>
                    <rect x="100" y="100" width="8" height="8" rx="1"/>
                  </g>
                </svg>
              </div>
              @if (ticket()) {
                <p class="qr-label">{{ ticket()!.code }}</p>
              }
              <p class="qr-hint">Presenta este código en la entrada</p>
            </div>
          </div>

          <div class="ticket-actions">
            <a [routerLink]="['/eventos', booking()!.event?.id]" class="btn btn-outline">Ver Evento</a>
            <a routerLink="/mis-eventos" class="btn btn-ghost">Mis Reservas</a>
          </div>
        </div>
      }
    </main>
  `,
  styles: [`
    .ticket-page {
      padding: var(--space-2xl) var(--space-md);
    }
    .ticket-wrapper {
      max-width: 700px;
      margin: 0 auto;
    }
    .ticket {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }
    .ticket-left {
      padding: var(--space-xl);
    }
    .ticket-brand {
      font-family: var(--font-display);
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: var(--space-md);
    }
    .ticket-left h2 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-lg);
    }
    .ticket-row {
      display: flex;
      justify-content: space-between;
      padding: var(--space-sm) 0;
      border-bottom: 1px dashed var(--color-border);
      font-size: var(--text-sm);
    }
    .ticket-row:last-child { border-bottom: none; }
    .ticket-label { color: var(--color-muted); }
    .ticket-value { font-weight: 600; }
    .status-text { text-transform: capitalize; }
    .mono { font-family: var(--font-mono); font-size: var(--text-xs); }
    .ticket-divider {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40px;
      position: relative;
    }
    .notch {
      width: 40px;
      height: 20px;
      background: var(--color-background);
      border-radius: 50%;
    }
    .notch.top { margin-top: -10px; }
    .notch.bottom { margin-bottom: -10px; }
    .dashed-line {
      flex: 1;
      width: 0;
      border-left: 2px dashed var(--color-border);
    }
    .ticket-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
    }
    .qr-code {
      width: 140px;
      height: 140px;
      margin-bottom: var(--space-md);
    }
    .qr-code svg { width: 100%; height: 100%; }
    .qr-label {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      color: var(--color-muted);
      margin-bottom: var(--space-xs);
    }
    .qr-hint {
      font-size: var(--text-xs);
      color: var(--color-muted);
      text-align: center;
    }
    .ticket-actions {
      display: flex;
      justify-content: center;
      gap: var(--space-md);
      margin-top: var(--space-xl);
    }
    .ticket-loading { text-align: center; padding: var(--space-3xl); }
    .skel-block {
      width: 100%;
      max-width: 700px;
      height: 300px;
      background: var(--color-border);
      border-radius: var(--radius-lg);
      margin: 0 auto;
    }
    @media (max-width: 640px) {
      .ticket {
        grid-template-columns: 1fr;
      }
      .ticket-divider {
        flex-direction: row;
        height: 40px;
        width: 100%;
      }
      .notch { width: 20px; height: 40px; margin-top: 0; margin-bottom: 0; }
      .notch.top { margin-left: -10px; }
      .notch.bottom { margin-right: -10px; }
      .dashed-line { border-left: none; border-top: 2px dashed var(--color-border); height: 0; }
    }
  `],
})
export default class TicketComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingsService = inject(BookingsService);

  booking = signal<Booking | null>(null);
  ticket = signal<Ticket | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const bookingId = params['bookingId'];
      this.loadBooking(bookingId);
    });
  }

  loadBooking(bookingId: string): void {
    this.loading.set(true);
    this.bookingsService.mine().subscribe({
      next: (res) => {
        const found = res.bookings.find((b) => b.id === bookingId);
        if (found) {
          this.booking.set(found);
          this.loadTicket(bookingId);
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadTicket(bookingId: string): void {
    this.bookingsService.getTicket(bookingId).subscribe({
      next: (res) => {
        this.ticket.set(res.ticket);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  formatDate(): string {
    const d = this.booking()?.event?.date;
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return d;
    }
  }
}
