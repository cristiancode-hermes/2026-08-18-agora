import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import type { Venue, VenuesResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class VenuesService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders(this.auth.getAuthHeaders());
  }

  list() {
    return this.http.get<VenuesResponse>('/api/venues');
  }

  getById(id: string) {
    return this.http.get<{ venue: Venue }>(`/api/venues/${id}`);
  }

  create(venue: Partial<Venue>) {
    return this.http.post<{ venue: Venue }>('/api/venues', venue, { headers: this.getHeaders() });
  }
}
