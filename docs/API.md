# API Documentation — Agora

## Base URL

`http://localhost:3100/api`

## Authentication

All authenticated endpoints require `Authorization: Bearer <token>` header.

### POST /api/auth/register
Register a new user.
- **Body:** `{ username: string, email: string, password: string }`
- **Response:** `{ user: User, token: string }`

### POST /api/auth/login
Login with username or email.
- **Body:** `{ login: string, password: string }`
- **Response:** `{ user: User, token: string }`

### GET /api/auth/me
Get current user profile (requires auth).
- **Response:** `{ user: User }`

## Events

### GET /api/events
List events with filters.
- **Query:** `?category=&date=&minPrice=&maxPrice=&search=&page=&limit=`
- **Response:** `{ events: Event[], total, page, pages }`

### GET /api/events/featured
Get 3 featured events for homepage.
- **Response:** `{ events: Event[] }`

### GET /api/events/:id
Get event detail with venue, category, organizer.
- **Response:** `{ event: Event }`

### POST /api/events
Create event (organizer role required).
- **Body:** `{ title, description, date, time, durationMin, venueId, categoryId, price, capacity, imageUrl, tags }`

### PATCH /api/events/:id
Update event (owner only).

### PATCH /api/events/:id/status
Change event status.
- **Body:** `{ status: 'draft' | 'published' | 'cancelled' }`

## Bookings

### POST /api/events/:eventId/bookings
Create booking (SELECT FOR UPDATE transaction).
- **Body:** `{ spotsCount: number }` (1-4)
- **Response:** `{ booking, ticket }`
- **Errors:** 409 (full), 400 (duplicate active booking)

### GET /api/bookings/mine
Get user's bookings.
- **Query:** `?status=&page=`
- **Response:** `{ bookings: Booking[], total }`

### GET /api/bookings/:id/ticket
Get ticket data with QR token.

### PATCH /api/bookings/:id/cancel
Cancel booking (24h policy).

### PATCH /api/events/:eventId/bookings/:id/checkin
Check-in attendee (organizer only).

## Venues

### GET /api/venues
List all venues.

### GET /api/venues/:id
Get venue detail.

### POST /api/venues
Create venue (organizer role).

## Categories

### GET /api/categories
List all categories.

## Reviews

### GET /api/events/:eventId/reviews
Get reviews + avg rating + count.

### POST /api/events/:eventId/reviews
Create review (only for attended events).
- **Body:** `{ rating: number, comment: string }`

### DELETE /api/reviews/:id
Delete review (admin only).

## Stats

### GET /api/stats/organizer
Organizer dashboard: totalEvents, totalBookings, totalRevenue, avgOccupancy, events[].

### GET /api/stats/organizer/:eventId
Stats for specific event.

### GET /api/stats/admin
Admin dashboard: totalUsers, totalEvents, totalBookings, globalOccupancy, topEvents, weeklyTrend.

### GET /api/stats/admin/weekly-trend
Bookings per day for last 12 weeks.

## Seed

### POST /api/seed
Load demo data (dev only, SEED_DB=true).

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Visitor | demo@agora.dev | demo1234 |
| Organizer | organizer@agora.dev | demo1234 |
