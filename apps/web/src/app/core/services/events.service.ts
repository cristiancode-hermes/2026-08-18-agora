import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import type { EventItem, PaginatedEvents } from '../models';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders(this.auth.getAuthHeaders());
  }

  list(params?: {
    category?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const httpParams: Record<string, string> = {};
    if (params) {
      if (params.category) httpParams['category'] = params.category;
      if (params.date) httpParams['date'] = params.date;
      if (params.minPrice !== undefined) httpParams['minPrice'] = String(params.minPrice);
      if (params.maxPrice !== undefined) httpParams['maxPrice'] = String(params.maxPrice);
      if (params.search) httpParams['search'] = params.search;
      if (params.page) httpParams['page'] = String(params.page);
      if (params.limit) httpParams['limit'] = String(params.limit);
    }
    const qs = new URLSearchParams(httpParams).toString();
    return this.http.get<PaginatedEvents>(`/api/events${qs ? '?' + qs : ''}`);
  }

  featured() {
    return this.http.get<{ events: EventItem[] }>('/api/events/featured');
  }

  getById(id: string) {
    return this.http.get<{ event: EventItem }>(`/api/events/${id}`);
  }

  create(event: Partial<EventItem>) {
    return this.http.post<{ event: EventItem }>('/api/events', event, { headers: this.getHeaders() });
  }

  update(id: string, event: Partial<EventItem>) {
    return this.http.patch<{ event: EventItem }>(`/api/events/${id}`, event, { headers: this.getHeaders() });
  }

  updateStatus(id: string, status: string) {
    return this.http.patch<{ status: string }>(`/api/events/${id}/status`, { status }, { headers: this.getHeaders() });
  }
}
