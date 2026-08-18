import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/user.entity';
import { Venue } from '../venues/venue.entity';
import { Category } from '../categories/category.entity';
import { Event } from '../events/event.entity';
import { Booking } from '../bookings/booking.entity';
import { Review } from '../reviews/review.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Venue) private venuesRepo: Repository<Venue>,
    @InjectRepository(Category) private categoriesRepo: Repository<Category>,
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
    @InjectRepository(Booking) private bookingsRepo: Repository<Booking>,
    @InjectRepository(Review) private reviewsRepo: Repository<Review>,
  ) {}

  async onModuleInit() {
    if (process.env.SEED_DB !== 'true') {
      return;
    }

    this.logger.log('Seeding database...');
    const existingUsers = await this.usersRepo.count();
    if (existingUsers > 0) {
      this.logger.log('Database already seeded, skipping.');
      return;
    }

    await this.seed();
    this.logger.log('Database seeded successfully!');
  }

  private async seed() {
    const passwordHash = await bcrypt.hash('demo1234', 12);

    // ── Users ──
    const visitorEntity = this.usersRepo.create({
      username: 'demo_visitante',
      email: 'demo@agora.dev',
      password: passwordHash,
      role: 'visitor',
    } as any);
    const savedVisitor = (await this.usersRepo.save(visitorEntity)) as any as User;

    const organizerEntity = this.usersRepo.create({
      username: 'demo_organizador',
      email: 'organizer@agora.dev',
      password: passwordHash,
      role: 'organizer',
    } as any);
    const savedOrganizer = (await this.usersRepo.save(organizerEntity)) as any as User;

    const adminEntity = this.usersRepo.create({
      username: 'admin_user',
      email: 'admin@agora.dev',
      password: passwordHash,
      role: 'admin',
    } as any);
    const savedAdmin = (await this.usersRepo.save(adminEntity)) as any as User;

    // ── Categories ──
    const categories = (await this.categoriesRepo.save([
      { name: 'Música', slug: 'musica', icon: '🎵', color: '#8B5CF6' },
      { name: 'Talleres', slug: 'talleres', icon: '🎨', color: '#C75B39' },
      { name: 'Gastronomía', slug: 'gastronomia', icon: '🍷', color: '#2D5A3D' },
      { name: 'Deportes', slug: 'deportes', icon: '⚽', color: '#059669' },
      { name: 'Yoga/Wellness', slug: 'yoga-wellness', icon: '🧘', color: '#6366F1' },
    ]));

    // ── Venues ──
    const venues = (await this.venuesRepo.save([
      { name: 'Centro Cultural Malasaña', address: 'Calle de Fuencarral, 52, Madrid', lat: 40.4230, lng: -3.7020, capacity: 200, description: 'Espacio cultural en el corazón de Malasaña' },
      { name: 'La Clamores', address: 'Calle de Bravo Murillo, 201, Madrid', lat: 40.4495, lng: -3.7010, capacity: 300, description: 'Sala de conciertos y eventos' },
      { name: 'Mercado de San Miguel', address: 'Plaza de San Miguel, s/n, Madrid', lat: 40.4155, lng: -3.7095, capacity: 150, description: 'Mercado gastronómico histórico' },
      { name: 'Parque del Retiro', address: 'Plaza de la Independencia, Madrid', lat: 40.4153, lng: -3.6845, capacity: 500, description: 'El pulmón verde de Madrid' },
      { name: 'Estudio Arte Vivo', address: 'Calle de los Embajadores, 46, Madrid', lat: 40.4078, lng: -3.7020, capacity: 80, description: 'Estudio de arte y talleres creativos' },
    ]));

    // ── Events ──
    const events = (await this.eventsRepo.save([
      {
        title: 'Taller de Cerámica', slug: 'taller-de-ceramica',
        description: 'Aprende los fundamentos de la cerámica en este taller práctico. Incluye materiales.',
        date: '2026-09-15', time: '10:00', durationMin: 180,
        venueId: venues[4].id, categoryId: categories[1].id, organizerId: savedOrganizer.id,
        price: 35, capacity: 20, spotsTaken: 12, status: 'published', tags: ['cerámica', 'taller', 'manualidades'],
      },
      {
        title: 'Concierto de Jazz', slug: 'concierto-de-jazz',
        description: 'Una noche mágica con el quinteto de jazz más hot de Madrid.',
        date: '2026-09-20', time: '20:00', durationMin: 120,
        venueId: venues[1].id, categoryId: categories[0].id, organizerId: savedOrganizer.id,
        price: 25, capacity: 250, spotsTaken: 180, status: 'published', tags: ['jazz', 'música', 'noche'],
      },
      {
        title: 'Ruta Gastronómica por Madrid', slug: 'ruta-gastronomica-por-madrid',
        description: 'Descubre los mejores sabores de Madrid en una ruta guiada por 5 locales.',
        date: '2026-09-22', time: '18:00', durationMin: 240,
        venueId: venues[2].id, categoryId: categories[2].id, organizerId: savedOrganizer.id,
        price: 45, capacity: 15, spotsTaken: 15, status: 'published', tags: ['gastronomía', 'tour', 'tapas'],
      },
      {
        title: 'Yoga al Amanecer', slug: 'yoga-al-amanecer',
        description: 'Sesión de yoga restaurativo al amanecer en el Retiro. Trae tu esterilla.',
        date: '2026-09-25', time: '07:00', durationMin: 60,
        venueId: venues[3].id, categoryId: categories[4].id, organizerId: savedOrganizer.id,
        price: 10, capacity: 50, spotsTaken: 22, status: 'published', tags: ['yoga', 'bienestar', 'naturaleza'],
      },
      {
        title: 'Campeonato de Pádel', slug: 'campeonato-de-padel',
        description: 'Torneo amateur de pádel. Premios para los 3 primeros clasificados.',
        date: '2026-10-01', time: '09:00', durationMin: 480,
        venueId: venues[3].id, categoryId: categories[3].id, organizerId: savedOrganizer.id,
        price: 20, capacity: 32, spotsTaken: 28, status: 'published', tags: ['pádel', 'deporte', 'torneo'],
      },
      {
        title: 'Feria Vintage', slug: 'feria-vintage',
        description: 'Ropa vintage, antigüedades y DJ set. ¡No te lo pierdas!',
        date: '2026-10-05', time: '11:00', durationMin: 360,
        venueId: venues[0].id, categoryId: categories[1].id, organizerId: savedOrganizer.id,
        price: 5, capacity: 150, spotsTaken: 45, status: 'published', tags: ['vintage', 'moda', 'flea-market'],
      },
      {
        title: 'Clase de Cocina Española', slug: 'clase-de-cocina-espanola',
        description: 'Aprende a cocinar paella, tortilla y gazpacho con un chef profesional.',
        date: '2026-10-08', time: '17:00', durationMin: 150,
        venueId: venues[2].id, categoryId: categories[2].id, organizerId: savedOrganizer.id,
        price: 55, capacity: 12, spotsTaken: 10, status: 'published', tags: ['cocina', 'gastronomía', 'clase'],
      },
      {
        title: 'Tour de Street Art', slug: 'tour-de-street-art',
        description: 'Recorrido guiado por los murales más impresionantes de Madrid.',
        date: '2026-10-12', time: '16:00', durationMin: 120,
        venueId: venues[0].id, categoryId: categories[1].id, organizerId: savedOrganizer.id,
        price: 15, capacity: 25, spotsTaken: 8, status: 'published', tags: ['arte', 'street-art', 'tour'],
      },
    ]));

    // ── Bookings ──
    const now = new Date();
    const fifteenMinAgo = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();

    await this.bookingsRepo.save([
      // Visitor bookings with used status (for review eligibility)
      { userId: savedVisitor.id, eventId: events[2].id, status: 'used', spotsCount: 1, totalPaid: 45, qrToken: uuidv4(), expiresAt: null, createdAt: threeDaysAgo } as any,
      { userId: savedVisitor.id, eventId: events[1].id, status: 'used', spotsCount: 2, totalPaid: 50, qrToken: uuidv4(), expiresAt: null, createdAt: threeDaysAgo } as any,
      { userId: savedVisitor.id, eventId: events[3].id, status: 'used', spotsCount: 1, totalPaid: 10, qrToken: uuidv4(), expiresAt: null, createdAt: twoDaysAgo } as any,
      // Confirmed bookings
      { userId: savedVisitor.id, eventId: events[0].id, status: 'confirmed', spotsCount: 1, totalPaid: 35, qrToken: uuidv4(), expiresAt: null, createdAt: oneHourAgo } as any,
      { userId: savedVisitor.id, eventId: events[4].id, status: 'confirmed', spotsCount: 2, totalPaid: 40, qrToken: uuidv4(), expiresAt: null, createdAt: oneHourAgo } as any,
      // Pending booking (will expire)
      { userId: savedVisitor.id, eventId: events[5].id, status: 'pending', spotsCount: 1, totalPaid: 5, qrToken: uuidv4(), expiresAt: fifteenMinAgo } as any,
      // Cancelled booking
      { userId: savedVisitor.id, eventId: events[7].id, status: 'cancelled', spotsCount: 1, totalPaid: 15, qrToken: uuidv4(), expiresAt: null, createdAt: twoDaysAgo } as any,
      // More visitor bookings
      { userId: savedVisitor.id, eventId: events[6].id, status: 'confirmed', spotsCount: 1, totalPaid: 55, qrToken: uuidv4(), expiresAt: null, createdAt: oneHourAgo } as any,
      // Admin bookings
      { userId: savedAdmin.id, eventId: events[1].id, status: 'used', spotsCount: 1, totalPaid: 25, qrToken: uuidv4(), expiresAt: null, createdAt: threeDaysAgo } as any,
      { userId: savedAdmin.id, eventId: events[4].id, status: 'confirmed', spotsCount: 1, totalPaid: 20, qrToken: uuidv4(), expiresAt: null, createdAt: oneHourAgo } as any,
      { userId: savedAdmin.id, eventId: events[0].id, status: 'confirmed', spotsCount: 2, totalPaid: 70, qrToken: uuidv4(), expiresAt: null, createdAt: oneHourAgo } as any,
      { userId: savedAdmin.id, eventId: events[7].id, status: 'confirmed', spotsCount: 1, totalPaid: 15, qrToken: uuidv4(), expiresAt: null, createdAt: oneHourAgo } as any,
    ]);

    // ── Reviews ──
    await this.reviewsRepo.save([
      { userId: savedVisitor.id, eventId: events[2].id, rating: 5, comment: '¡Una experiencia increíble! La ruta gastronómica fue perfecta.' } as any,
      { userId: savedVisitor.id, eventId: events[1].id, rating: 4, comment: 'Gran concierto, el ambiente era fantástico.' } as any,
      { userId: savedVisitor.id, eventId: events[3].id, rating: 5, comment: 'Yoga al amanecer es mágico. El parque estaba precioso.' } as any,
      { userId: savedAdmin.id, eventId: events[1].id, rating: 5, comment: 'El quinteto de jazz estuvo espectacular. Repetiré.' } as any,
      { userId: savedVisitor.id, eventId: events[5].id, rating: 4, comment: 'La feria vintage tenía cosas muy chulas, aunque hacía un poco de calor.' } as any,
      { userId: savedAdmin.id, eventId: events[4].id, rating: 3, comment: 'Bien organizado, pero las pistas estaban un poco deterioradas.' } as any,
    ]);

    this.logger.log(`Seeded: 3 users, ${categories.length} categories, ${venues.length} venues, ${events.length} events, 12 bookings, 6 reviews`);
  }
}
