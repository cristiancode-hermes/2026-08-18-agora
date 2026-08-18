import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import type { OrganizerStats, EventStats, AdminStats, WeeklyTrendResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders(this.auth.getAuthHeaders());
  }

  organizer() {
    return this.http.get<OrganizerStats>('/api/stats/organizer', { headers: this.getHeaders() });
  }

  eventStats(eventId: string) {
    return this.http.get<EventStats>(`/api/stats/organizer/${eventId}`, { headers: this.getHeaders() });
  }

  admin() {
    return this.http.get<AdminStats>('/api/stats/admin', { headers: this.getHeaders() });
  }

  adminWeeklyTrend() {
    return this.http.get<WeeklyTrendResponse>('/api/stats/admin/weekly-trend', { headers: this.getHeaders() });
  }
}
