# Agora — Community Events & Experiences Marketplace

Marketplace B2C para descubrir, reservar y asistir a eventos locales: talleres, conciertos, rutas gastronómicas, clases de arte, sesiones de yoga.

## Features

- **Reserva transaccional** con control de aforo: mutex por evento, transacción SQL, spotsAvailable siempre desde la misma query
- **Expiración server-side**: expiresAt calculado en el servidor (15 min), sweeper que cancela pendientes vencidas
- **Ticket con QR**: código QR único por reserva, verificable por el organizador en check-in
- **Home pública** con eventos destacados del día/semana, búsqueda y filtros por categoría, fecha, precio
- **Organizador**: dashboard con métricas (ocupación, ingresos, asistentes), gestión de eventos y lista de asistentes
- **Admin**: moderación de reseñas, eventos, estadísticas globales con gráfico de tendencia semanal

## Stack

- **Frontend**: Angular 22 + Signals + Zoneless + Tailwind CSS v4
- **Backend**: NestJS 11 + TypeORM + JWT Auth (Passport)
- **Database**: SQLite (dev, better-sqlite3)

## Demo Credentials

- **Visitante**: demo_visitante / demo1234
- **Organizador**: demo_organizador / demo1234
- **Admin**: admin_user / demo1234

## API Endpoints

- `POST /api/auth/register` — Register (username, email, password)
- `POST /api/auth/login` — Login (login, password)
- `GET /api/events` — List events with filters
- `GET /api/events/featured` — Featured events
- `GET /api/events/:id` — Event detail
- `POST /api/events/:eventId/bookings` — Create booking
- `GET /api/bookings/mine` — My bookings
- `GET /api/bookings/:id/ticket` — Get ticket with QR

## Development

```bash
# Install dependencies
npm install

# Start API
cd apps/api && SEED_DB=true PORT=8971 node dist/main.js

# Build Angular
cd apps/web && ng build --configuration production
```

## Deployment

- **URL**: https://agora.proyectos.cristiancode.dev
- **API Port**: 8971
- **Caddy**: Reverse proxy for /api/* → localhost:8971

## License

MIT
