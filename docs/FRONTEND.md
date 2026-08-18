# Frontend Documentation — Agora

## Overview

Angular 22 SPA with signal-based state management, zoneless change detection, and standalone components. Design system uses CSS custom properties with "Luminary" palette.

## Routes

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/` | HomeComponent | No | Hero + featured events + categories |
| `/eventos` | CatalogueComponent | No | Event catalog with filters |
| `/eventos/:id` | EventDetailComponent | No | Event detail with booking |
| `/eventos/:id/review` | ReviewFormComponent | Yes | Leave review (attended events) |
| `/login` | LoginComponent | No | Split-screen login |
| `/registro` | RegisterComponent | No | Split-screen registration |
| `/mis-eventos` | MyBookingsComponent | Yes | User's bookings list |
| `/mis-eventos/:bookingId/ticket` | TicketComponent | Yes | Ticket with QR |
| `/organizador` | OrgDashboardComponent | Yes (org) | Organizer dashboard |
| `/organizador/nuevo` | EventFormComponent | Yes (org) | Create event |
| `/organizador/:id/editar` | EventFormComponent | Yes (org) | Edit event |
| `/organizador/:eventId/asistentes` | AttendeeListComponent | Yes (org) | Attendee list |
| `/admin` | AdminDashboardComponent | Yes (admin) | Admin dashboard |
| `/admin/reviews` | ReviewModerationComponent | Yes (admin) | Moderate reviews |
| `/admin/eventos` | AdminEventsComponent | Yes (admin) | Manage events |

## Design System — "Luminary"

### Colors (Light)
- Primary: `#2D5A3D` (forest green)
- Secondary: `#E8A838` (warm amber)
- Accent: `#C75B39` (terracotta)
- Surface: `#FAFAF7` (soft cream)
- Background: `#F0EDE5` (light sand)
- Ink: `#1A1A1A`
- Muted: `#6B7280`

### Typography
- Display: Playfair Display (serif)
- Body: DM Sans (sans-serif)
- Mono: JetBrains Mono

### Dark Mode
Toggle via sun/moon icon in navbar. Persisted in localStorage.

## Component Architecture

### Signal Pattern
```typescript
export class ExampleComponent {
  data = signal<any>(null);
  loading = signal(true);
  derived = computed(() => this.data()?.value ?? 0);
}
```

### Lazy Loading
All page components are lazy-loaded via `loadComponent` in routes.

### Auth Flow
1. Login → JWT stored in localStorage
2. AuthInterceptor attaches Bearer token
3. AuthGuard redirects to /login if not authenticated
4. RoleGuard checks user role

## Booking Flow

1. User selects quantity (1-4) on event detail
2. POST `/api/events/:id/bookings` with `spotsCount`
3. Backend: BEGIN IMMEDIATE → check capacity → INSERT booking → COMMIT
4. Success: show ticket with QR
5. 409: "Aforo completo"
6. 400: "Ya tienes una reserva activa"

## Event Card Variants

Cards visually differ by category to avoid identical grid anti-pattern:
- **Música:** Full-bleed image + gradient overlay
- **Talleres:** Left border accent
- **Gastronomía:** Image + rating overlay
- **Deportes:** Image + intensity badge
- **Yoga:** Minimal, no image, large typography
