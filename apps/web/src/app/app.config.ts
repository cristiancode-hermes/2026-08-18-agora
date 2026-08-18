import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component') },
  { path: 'registro', loadComponent: () => import('./pages/register/register.component') },
  { path: 'eventos', loadComponent: () => import('./pages/catalogue/catalogue.component') },
  { path: 'eventos/:id', loadComponent: () => import('./pages/event-detail/event-detail.component') },
  { path: 'eventos/:id/review', loadComponent: () => import('./pages/review-form/review-form.component') },
  { path: 'mis-eventos', loadComponent: () => import('./pages/my-bookings/my-bookings.component') },
  { path: 'mis-eventos/:bookingId/ticket', loadComponent: () => import('./pages/ticket/ticket.component') },
  { path: 'organizador', loadComponent: () => import('./pages/org-dashboard/org-dashboard.component') },
  { path: 'organizador/nuevo', loadComponent: () => import('./pages/event-form/event-form.component') },
  { path: 'organizador/:id/editar', loadComponent: () => import('./pages/event-form/event-form.component') },
  { path: 'organizador/:eventId/asistentes', loadComponent: () => import('./pages/attendee-list/attendee-list.component') },
  { path: 'admin', loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component') },
  { path: 'admin/reviews', loadComponent: () => import('./pages/review-moderation/review-moderation.component') },
  { path: 'admin/eventos', loadComponent: () => import('./pages/admin-events/admin-events.component') },
  { path: '', loadComponent: () => import('./pages/home/home.component') },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component') },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
  ]
};
