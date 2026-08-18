import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent, FooterComponent, ToastComponent],
  template: `
    <app-toast />
    <div class="auth-split">
      <div class="auth-visual">
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" alt="Eventos" />
        <div class="auth-visual-overlay">
          <h1>Agora</h1>
          <p>Descubre experiencias que merecen ser vividas</p>
        </div>
      </div>
      <div class="auth-form-side">
        <div class="auth-form-wrapper">
          <div class="auth-header">
            <a routerLink="/" class="auth-brand-mobile">Agora</a>
            <h2>Bienvenido de vuelta</h2>
            <p>Inicia sesión para continuar</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="login">Email o usuario</label>
              <input
                id="login"
                class="form-input"
                type="text"
                [(ngModel)]="login"
                name="login"
                placeholder="tu@email.com"
                autocomplete="off"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Contraseña</label>
              <input
                id="password"
                class="form-input"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                autocomplete="off"
                required
              />
            </div>

            @if (error()) {
              <div class="auth-error">{{ error() }}</div>
            }

            <button type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner"></span> Entrando...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>

          <p class="auth-switch">
            ¿No tienes cuenta? <a routerLink="/registro">Regístrate aquí</a>
          </p>

          <div class="demo-credentials">
            <h4>Credenciales de demo</h4>
            <div class="demo-grid">
              <div class="demo-card">
                <span class="demo-role">Visitante</span>
                <div class="demo-field">
                  <span class="demo-label">Email:</span>
                  <span class="demo-value">demo&#64;agora.dev</span>
                </div>
                <div class="demo-field">
                  <span class="demo-label">Password:</span>
                  <span class="demo-value">demo1234</span>
                </div>
                <button class="btn btn-ghost btn-sm" (click)="fillDemo('demo@agora.dev', 'demo1234')">
                  Usar estas credenciales
                </button>
              </div>
              <div class="demo-card">
                <span class="demo-role">Organizador</span>
                <div class="demo-field">
                  <span class="demo-label">Email:</span>
                  <span class="demo-value">organizer&#64;agora.dev</span>
                </div>
                <div class="demo-field">
                  <span class="demo-label">Password:</span>
                  <span class="demo-value">demo1234</span>
                </div>
                <button class="btn btn-ghost btn-sm" (click)="fillDemo('organizer@agora.dev', 'demo1234')">
                  Usar estas credenciales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
    }
    .auth-visual {
      position: relative;
      overflow: hidden;
    }
    .auth-visual img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .auth-visual-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(45,90,61,0.9), rgba(45,90,61,0.7));
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      text-align: center;
      padding: var(--space-2xl);
    }
    .auth-visual-overlay h1 {
      font-family: var(--font-display);
      font-size: var(--text-6xl);
      font-weight: 700;
      margin-bottom: var(--space-md);
    }
    .auth-visual-overlay p {
      font-size: var(--text-lg);
      opacity: 0.9;
      max-width: 360px;
    }
    .auth-form-side {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      background: var(--color-surface);
    }
    .auth-form-wrapper {
      width: 100%;
      max-width: 420px;
    }
    .auth-brand-mobile {
      display: none;
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--color-primary);
      text-decoration: none;
      margin-bottom: var(--space-lg);
    }
    .auth-header {
      margin-bottom: var(--space-xl);
    }
    .auth-header h2 {
      font-size: var(--text-3xl);
      margin-bottom: var(--space-xs);
    }
    .auth-header p {
      color: var(--color-muted);
    }
    .auth-form { margin-bottom: var(--space-lg); }
    .auth-error {
      background: rgba(220, 38, 38, 0.1);
      color: var(--color-danger);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      margin-bottom: var(--space-md);
    }
    .auth-switch {
      text-align: center;
      font-size: var(--text-sm);
      color: var(--color-muted);
    }
    .auth-switch a {
      font-weight: 600;
    }
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .demo-credentials {
      margin-top: var(--space-xl);
      padding: var(--space-lg);
      background: var(--color-background);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }
    .demo-credentials h4 {
      font-size: var(--text-sm);
      font-weight: 600;
      margin-bottom: var(--space-md);
      text-align: center;
    }
    .demo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }
    .demo-card {
      padding: var(--space-md);
      background: var(--color-surface);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
    }
    .demo-role {
      display: block;
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: uppercase;
      color: var(--color-primary);
      margin-bottom: var(--space-sm);
    }
    .demo-field {
      font-size: var(--text-xs);
      margin-bottom: 4px;
    }
    .demo-label { color: var(--color-muted); }
    .demo-value { font-family: var(--font-mono); font-size: 0.7rem; }
    .demo-card .btn { margin-top: var(--space-sm); width: 100%; }
    @media (max-width: 768px) {
      .auth-split { grid-template-columns: 1fr; }
      .auth-visual { display: none; }
      .auth-brand-mobile { display: block; }
    }
  `],
})
export default class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  login = '';
  password = '';
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  fillDemo(email: string, pass: string): void {
    this.login = email;
    this.password = pass;
  }

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.login, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Credenciales incorrectas');
      },
    });
  }
}
