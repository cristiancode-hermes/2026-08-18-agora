import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import type { Booking, Ticket, PaginatedBookings } from '../models';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders(this.auth.getAuthHeaders());
  }

  create(eventId: string, spotsCount: number) {
    return this.http.post<{ booking: Booking; ticket: Ticket }>(
      `/api/events/${eventId}/bookings`,
      { spotsCount },
      { headers: this.getHeaders() }
    );
  }

  mine(params?: { status?: string; page?: number }) {
    const httpParams: Record<string, string> = {};
    if (params?.status) httpParams['status'] = params.status;
    if (params?.page) httpParams['page'] = String(params.page);
    const qs = new URLSearchParams(httpParams).toString();
    return this.http.get<PaginatedBookings>(`/api/bookings/mine${qs ? '?' + qs : ''}`, { headers: this.getHeaders() });
  }

  getTicket(bookingId: string) {
    return this.http.get<{ ticket: Ticket }>(`/api/bookings/${bookingId}/ticket`, { headers: this.getHeaders() });
  }

  cancel(bookingId: string) {
    return this.http.patch<{ booking: Booking }>(
      `/api/bookings/${bookingId}/cancel`,
      {},
      { headers: this.getHeaders() }
    );
  }

  checkin(eventId: string, bookingId: string) {
    return this.http.patch<{ booking: Booking }>(
      `/api/events/${eventId}/bookings/${bookingId}/checkin`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
