import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import type { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  token = signal<string | null>(this.getStoredToken());
  isLoading = signal(true);

  isAuthenticated = computed(() => !!this.currentUser());
  isOrganizer = computed(() => this.currentUser()?.role === 'organizer' || this.currentUser()?.role === 'admin');
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem('agora-token');
    } catch {
      return null;
    }
  }

  private storeToken(token: string): void {
    try {
      localStorage.setItem('agora-token', token);
    } catch {
      // localStorage not available
    }
  }

  private clearToken(): void {
    try {
      localStorage.removeItem('agora-token');
    } catch {
      // localStorage not available
    }
  }

  constructor() {
    if (this.token()) {
      this.me().subscribe();
    } else {
      this.isLoading.set(false);
    }
  }

  login(login: string, password: string) {
    return this.http.post<{ user: User; token: string }>('/api/auth/login', { login, password }).pipe(
      tap((res) => {
        this.token.set(res.token);
        this.currentUser.set(res.user);
        this.storeToken(res.token);
      })
    );
  }

  register(username: string, email: string, password: string) {
    return this.http.post<{ user: User; token: string }>('/api/auth/register', { username, email, password }).pipe(
      tap((res) => {
        this.token.set(res.token);
        this.currentUser.set(res.user);
        this.storeToken(res.token);
      })
    );
  }

  me() {
    return this.http.get<{ user: User }>('/api/auth/me').pipe(
      tap((res) => {
        this.currentUser.set(res.user);
        this.isLoading.set(false);
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    this.clearToken();
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): Record<string, string> {
    const t = this.token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
}
