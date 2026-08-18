import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="nf-content">
        <span class="nf-code">404</span>
        <h1>Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
      padding: var(--space-lg);
    }
    .nf-code {
      font-family: var(--font-display);
      font-size: 8rem;
      font-weight: 700;
      color: var(--color-border);
      line-height: 1;
    }
    .nf-content h1 {
      font-size: var(--text-3xl);
      margin: var(--space-md) 0 var(--space-sm);
    }
    .nf-content p {
      color: var(--color-muted);
      margin-bottom: var(--space-xl);
    }
  `],
})
export default class NotFoundComponent {}
