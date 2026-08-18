import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import type { Review, ReviewResponse, PaginatedReviews } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders(this.auth.getAuthHeaders());
  }

  listByEvent(eventId: string) {
    return this.http.get<ReviewResponse>(`/api/events/${eventId}/reviews`);
  }

  create(eventId: string, rating: number, comment: string) {
    return this.http.post<{ review: Review }>(
      `/api/events/${eventId}/reviews`,
      { rating, comment },
      { headers: this.getHeaders() }
    );
  }

  delete(reviewId: string) {
    return this.http.delete(`/api/reviews/${reviewId}`, { headers: this.getHeaders() });
  }

  listAll(params?: { page?: number; limit?: number }) {
    const httpParams: Record<string, string> = {};
    if (params?.page) httpParams['page'] = String(params.page);
    if (params?.limit) httpParams['limit'] = String(params.limit);
    const qs = new URLSearchParams(httpParams).toString();
    return this.http.get<PaginatedReviews>(`/api/reviews${qs ? '?' + qs : ''}`, { headers: this.getHeaders() });
  }
}
