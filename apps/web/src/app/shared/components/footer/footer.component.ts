import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">Agora</span>
          <p>Experiencias que merecen ser vividas</p>
        </div>
        <div class="footer-links">
          <a routerLink="/eventos">Eventos</a>
          <a routerLink="/login">Iniciar Sesión</a>
          <a routerLink="/registro">Registrarse</a>
        </div>
        <div class="footer-copy">
          <p>&copy; 2026 Agora. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: var(--space-3xl);
      padding: var(--space-2xl) 0;
      border-top: 1px solid var(--color-border);
      background: var(--color-surface);
    }
    .footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-lg);
      text-align: center;
    }
    .footer-logo {
      font-family: var(--font-display);
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--color-primary);
    }
    .footer-brand p {
      font-size: var(--text-sm);
      color: var(--color-muted);
      margin-top: var(--space-xs);
    }
    .footer-links {
      display: flex;
      gap: var(--space-lg);
    }
    .footer-links a {
      font-size: var(--text-sm);
      color: var(--color-muted);
      transition: color var(--transition-fast);
    }
    .footer-links a:hover { color: var(--color-primary); }
    .footer-copy p {
      font-size: var(--text-xs);
      color: var(--color-muted);
      margin-bottom: 0;
    }
  `],
})
export class FooterComponent {}
