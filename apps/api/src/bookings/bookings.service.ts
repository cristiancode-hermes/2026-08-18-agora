import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Booking } from './booking.entity';
import { Event } from '../events/event.entity';
import { CreateBookingDto } from './dto/booking.dto';

// Promise-based mutex for SQLite to prevent concurrent transaction crashes
class Mutex {
  private locks = new Map<string, Promise<void>>();

  async acquire(key: string): Promise<() => void> {
    while (this.locks.has(key)) {
      await this.locks.get(key);
    }
    let releaseFn: () => void;
    const promise = new Promise<void>((resolve) => {
      releaseFn = () => {
        this.locks.delete(key);
        resolve();
      };
    });
    this.locks.set(key, promise);
    return releaseFn!;
  }
}

@Injectable()
export class BookingsService {
  private mutex = new Mutex();

  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async createBooking(eventId: number, userId: number, dto: CreateBookingDto) {
    const release = await this.mutex.acquire(`event-${eventId}`);
    try {
      // Mutex already serializes writes for SQLite — no pessimistic lock needed
      const event = await this.eventsRepository
        .createQueryBuilder('event')
        .where('event.id = :eventId', { eventId })
        .getOne();

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (event.status !== 'published') {
        throw new BadRequestException('Event is not available for booking');
      }

      // Re-check capacity inside the lock
      const spotsAvailable = await this.getSpotsAvailable(eventId);
      if (spotsAvailable < dto.spotsCount) {
        throw new BadRequestException(`Not enough spots available. Only ${spotsAvailable} left.`);
      }

      const totalPaid = event.price * dto.spotsCount;
      const qrToken = uuidv4();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      const booking = this.bookingsRepository.create({
        userId,
        eventId,
        spotsCount: dto.spotsCount,
        totalPaid,
        qrToken,
        expiresAt,
        status: event.price === 0 ? 'confirmed' : 'pending',
      } as any);

      const saved = (await this.bookingsRepository.save(booking)) as any as Booking;

      // Update spotsTaken on event
      await this.eventsRepository
        .createQueryBuilder()
        .update(Event)
        .set({ spotsTaken: () => `spotsTaken + ${dto.spotsCount}` })
        .where('id = :eventId', { eventId })
        .execute();

      return {
        booking: saved,
        ticket: {
          id: saved.id,
          qrToken: saved.qrToken,
          status: saved.status,
          spotsCount: saved.spotsCount,
          totalPaid: saved.totalPaid,
          expiresAt: saved.expiresAt,
        },
      };
    } finally {
      release();
    }
  }

  async getMyBookings(userId: number) {
    const bookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.event', 'event')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.venue', 'venue')
      .select([
        'booking',
        'event.id', 'event.title', 'event.date', 'event.time', 'event.imageUrl', 'event.price',
        'category.id', 'category.name', 'category.slug', 'category.icon',
        'venue.id', 'venue.name',
      ])
      .where('booking.userId = :userId', { userId })
      .orderBy('booking.createdAt', 'DESC')
      .getMany();
    return { bookings };
  }

  async getTicket(bookingId: number, userId: number) {
    const booking = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.event', 'event')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('event.venue', 'venue')
      .select([
        'booking',
        'event.id', 'event.title', 'event.date', 'event.time', 'event.imageUrl',
        'user.id', 'user.username', 'user.email',
        'venue.id', 'venue.name', 'venue.address',
      ])
      .where('booking.id = :bookingId', { bookingId })
      .getOne();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return {
      ticket: {
        id: booking.id,
        qrToken: booking.qrToken,
        status: booking.status,
        spotsCount: booking.spotsCount,
        totalPaid: booking.totalPaid,
        event: booking.event,
        user: { id: booking.user.id, username: booking.user.username, email: booking.user.email },
        venue: booking.event?.venue,
        expiresAt: booking.expiresAt,
      },
    };
  }

  async cancel(bookingId: number, userId: number) {
    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
      relations: ['event'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === 'used') {
      throw new BadRequestException('Cannot cancel a used booking');
    }

    // 24h cancellation policy
    const bookingTime = new Date(booking.createdAt).getTime();
    const now = Date.now();
    const hoursSinceBooking = (now - bookingTime) / (1000 * 60 * 60);
    if (hoursSinceBooking > 24) {
      throw new BadRequestException('Cannot cancel after 24 hours');
    }

    booking.status = 'cancelled';
    await this.bookingsRepository.save(booking);

    // Update spotsTaken
    await this.eventsRepository
      .createQueryBuilder()
      .update(Event)
      .set({ spotsTaken: () => `spotsTaken - ${booking.spotsCount}` })
      .where('id = :eventId', { eventId: booking.eventId })
      .execute();

    return booking;
  }

  async checkin(bookingId: number, eventId: number, organizerId: number) {
    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('Only the event organizer can check in attendees');
    }

    const booking = await this.bookingsRepository.findOne({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.eventId !== eventId) {
      throw new BadRequestException('Booking does not belong to this event');
    }

    if (booking.status === 'confirmed') {
      booking.status = 'used';
      await this.bookingsRepository.save(booking);
      return booking;
    }

    if (booking.status === 'pending') {
      // Auto-confirm pending bookings on check-in (e.g. free events)
      booking.status = 'used';
      await this.bookingsRepository.save(booking);
      return booking;
    }

    throw new BadRequestException(`Cannot check in booking with status: ${booking.status}`);
  }

  async getSpotsAvailable(eventId: number): Promise<number> {
    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) return 0;

    const result = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('COALESCE(SUM(booking.spotsCount), 0)', 'booked')
      .where('booking.eventId = :eventId', { eventId })
      .andWhere('booking.status IN (:...statuses)', { statuses: ['pending', 'confirmed'] })
      .getRawOne();

    const booked = parseInt(result?.booked || '0', 10);
    return event.capacity - booked;
  }
}
