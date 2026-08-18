# Architecture — Agora

## Overview

Agora is a B2C Community Events & Experiences Marketplace. Users discover, book, and attend local events: workshops, concerts, gastronomic routes, art classes, yoga sessions, sports tournaments, and fairs.

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Angular 22 + Signals + Zoneless | Standalone components, lazy routes, signal-based state |
| Backend | NestJS 11 + TypeORM + JWT | Modular architecture, Passport.js, bcryptjs |
| Database | SQLite (dev) / Neon PostgreSQL (prod) | better-sqlite3 locally, `synchronize: true` in dev |
| Styling | Pure CSS Design System | "Luminary" palette, Playfair Display + DM Sans |

## Monorepo Structure

```
2026-08-18-agora/
├── apps/
│   ├── api/              # NestJS backend
│   │   └── src/
│   │       ├── auth/     # JWT auth, guards, decorators
│   │       ├── users/    # User entity & service
│   │       ├── events/   # Event CRUD, search, filters
│   │       ├── venues/   # Venue CRUD
│   │       ├── categories/
│   │       ├── bookings/ # Transactional booking (mutex)
│   │       ├── reviews/  # User reviews
│   │       ├── stats/    # Dashboard aggregations
│   │       └── seed/     # Demo data
│   └── web/              # Angular 22 frontend
│       └── src/app/
│           ├── core/     # Services, guards, interceptors, models
│           ├── shared/   # Reusable components (navbar, footer, badges)
│           └── pages/    # Route-level components (lazy-loaded)
├── docs/                 # Documentation
└── data/                 # SQLite database files
```

## Key Design Decisions

### Transactional Booking
- Each event has finite capacity (spots)
- Booking uses `BEGIN IMMEDIATE` (SQLite) or `SELECT FOR UPDATE` (PostgreSQL)
- Mutex prevents concurrent transaction crashes on SQLite
- `expiresAt` calculated server-side (15 minutes)
- Sweeper cancels expired pending bookings every 30 seconds

### Authentication
- JWT with Passport.js
- Login accepts username OR email (portfolio convention)
- Roles: visitor, organizer, admin
- Auth interceptor attaches Bearer token to all API requests

### Dark Mode
- CSS custom properties swap via `.dark` class on `<html>`
- Persisted in localStorage (`agora-theme`)
- All components inherit tokens from root

## Security Notes

- Passwords hashed with bcryptjs (12 rounds)
- JWT secret from env `JWT_SECRET` or dev default
- ValidationPipe with `whitelist: true` + `forbidNonWhitelisted: true`
- CORS enabled for localhost development
