import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastComponent],
  template: `
    <app-toast />
    <div class="auth-split">
      <div class="auth-visual">
        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800" alt="Eventos" />
        <div class="auth-visual-overlay">
          <h1>Agora</h1>
          <p>Únete a la comunidad de experiencias</p>
        </div>
      </div>
      <div class="auth-form-side">
        <div class="auth-form-wrapper">
          <a routerLink="/" class="auth-brand-mobile">Agora</a>
          <div class="auth-header">
            <h2>Crear cuenta</h2>
            <p>Regístrate para reservar eventos</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="name">Nombre completo</label>
              <input
                id="name"
                class="form-input"
                type="text"
                [(ngModel)]="name"
                name="name"
                placeholder="Tu nombre"
                autocomplete="off"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                class="form-input"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="tu@email.com"
                autocomplete="off"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-password">Contraseña</label>
              <input
                id="reg-password"
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
                <span class="spinner"></span> Creando cuenta...
              } @else {
                Registrarse
              }
            </button>
          </form>

          <p class="auth-switch">
            ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
          </p>
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
      background: linear-gradient(135deg, rgba(199,91,57,0.85), rgba(199,91,57,0.7));
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
    @media (max-width: 768px) {
      .auth-split { grid-template-columns: 1fr; }
      .auth-visual { display: none; }
      .auth-brand-mobile { display: block; }
    }
  `],
})
export default class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');

    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.notify.success('Cuenta creada correctamente');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al crear la cuenta');
      },
    });
  }
}
