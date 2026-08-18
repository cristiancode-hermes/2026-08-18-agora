import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-inner container">
        <a class="navbar-brand" routerLink="/">Agora</a>

        <button class="navbar-toggle" (click)="mobileOpen.set(!mobileOpen())" [attr.aria-label]="mobileOpen() ? 'Cerrar menú' : 'Abrir menú'">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            @if (mobileOpen()) {
              <path d="M18 6L6 18M6 6l12 12"/>
            } @else {
              <path d="M3 12h18M3 6h18M3 18h18"/>
            }
          </svg>
        </button>

        <div class="navbar-links" [class.open]="mobileOpen()">
          <a routerLink="/eventos" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="mobileOpen.set(false)">Eventos</a>

          @if (auth.isAuthenticated()) {
            <a routerLink="/mis-eventos" routerLinkActive="active" (click)="mobileOpen.set(false)">Mis Reservas</a>
          }
          @if (auth.isOrganizer()) {
            <a routerLink="/organizador" routerLinkActive="active" (click)="mobileOpen.set(false)">Dashboard</a>
          }
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active" (click)="mobileOpen.set(false)">Admin</a>
          }
        </div>

        <div class="navbar-actions">
          <button class="theme-toggle" (click)="toggleTheme()" [attr.aria-label]="'Cambiar tema'">
            @if (isDark()) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>

          @if (auth.isAuthenticated()) {
            <div class="user-menu">
              <button class="user-btn" (click)="menuOpen.set(!menuOpen())">
                <span class="user-avatar">{{ userInitial() }}</span>
                <span class="user-name">{{ auth.currentUser()?.name }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              @if (menuOpen()) {
                <div class="dropdown-menu">
                  <a routerLink="/mis-eventos" (click)="menuOpen.set(false); mobileOpen.set(false)">Mis Reservas</a>
                  <button (click)="logout()">Cerrar Sesión</button>
                </div>
              }
            </div>
          } @else {
            <a class="btn btn-primary btn-sm" routerLink="/login" (click)="mobileOpen.set(false)">Iniciar Sesión</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      backdrop-filter: blur(12px);
    }
    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      gap: var(--space-lg);
    }
    .navbar-brand {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--color-primary);
      text-decoration: none;
      flex-shrink: 0;
    }
    .navbar-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--color-ink);
      cursor: pointer;
      padding: var(--space-sm);
    }
    .navbar-links {
      display: flex;
      gap: var(--space-lg);
      align-items: center;
    }
    .navbar-links a {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-muted);
      text-decoration: none;
      padding: var(--space-xs) 0;
      border-bottom: 2px solid transparent;
      transition: color var(--transition-fast), border-color var(--transition-fast);
    }
    .navbar-links a:hover,
    .navbar-links a.active {
      color: var(--color-primary);
      border-bottom-color: var(--color-primary);
    }
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }
    .theme-toggle {
      background: none;
      border: none;
      color: var(--color-muted);
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: var(--radius-sm);
      transition: color var(--transition-fast);
      display: flex;
      align-items: center;
    }
    .theme-toggle:hover { color: var(--color-secondary); }
    .user-menu { position: relative; }
    .user-btn {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      padding: 4px 12px 4px 4px;
      cursor: pointer;
      transition: border-color var(--transition-fast);
    }
    .user-btn:hover { border-color: var(--color-primary); }
    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-primary);
      color: var(--color-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xs);
      font-weight: 600;
    }
    .user-name {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-ink);
    }
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      min-width: 180px;
      overflow: hidden;
      z-index: 50;
    }
    .dropdown-menu a,
    .dropdown-menu button {
      display: block;
      width: 100%;
      padding: 10px 16px;
      font-size: var(--text-sm);
      color: var(--color-ink);
      text-decoration: none;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      transition: background var(--transition-fast);
      font-family: var(--font-body);
    }
    .dropdown-menu a:hover,
    .dropdown-menu button:hover {
      background: var(--color-background);
    }
    .dropdown-menu button {
      color: var(--color-danger);
    }
    @media (max-width: 768px) {
      .navbar-toggle { display: flex; }
      .navbar-links {
        display: none;
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        flex-direction: column;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        padding: var(--space-md);
        gap: var(--space-sm);
      }
      .navbar-links.open { display: flex; }
      .navbar-links a { padding: var(--space-sm) 0; border-bottom: none; }
      .user-name { display: none; }
    }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);

  mobileOpen = signal(false);
  menuOpen = signal(false);

  isDark = signal(false);

  constructor() {
    this.isDark.set(document.documentElement.classList.contains('dark'));
  }

  userInitial(): string {
    const name = this.auth.currentUser()?.name ?? '?';
    return name.charAt(0).toUpperCase();
  }

  toggleTheme(): void {
    const html = document.documentElement;
    html.classList.toggle('dark');
    this.isDark.set(html.classList.contains('dark'));
    try {
      localStorage.setItem('agora-theme', this.isDark() ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }

  logout(): void {
    this.menuOpen.set(false);
    this.mobileOpen.set(false);
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.menuOpen.set(false);
    }
  }
}
