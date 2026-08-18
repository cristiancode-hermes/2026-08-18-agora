import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/event.entity';
import { Booking } from '../bookings/booking.entity';
import { Review } from '../reviews/review.entity';
import { User } from '../users/user.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getOrganizerStats(organizerId: number) {
    const events = await this.eventsRepository.find({ where: { organizerId } });
    const eventIds = events.map((e) => e.id);

    if (eventIds.length === 0) {
      return {
        totalEvents: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalAttendees: 0,
        avgRating: 0,
      };
    }

    const bookingStats = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('COUNT(*)', 'totalBookings')
      .addSelect('COALESCE(SUM(booking.spotsCount), 0)', 'totalAttendees')
      .addSelect('COALESCE(SUM(booking.totalPaid), 0)', 'totalRevenue')
      .where('booking.eventId IN (:...eventIds)', { eventIds })
      .andWhere('booking.status IN (:...statuses)', { statuses: ['confirmed', 'used'] })
      .getRawOne();

    const reviewStats = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .where('review.eventId IN (:...eventIds)', { eventIds })
      .getRawOne();

    return {
      totalEvents: events.length,
      totalBookings: parseInt(bookingStats?.totalBookings || '0', 10),
      totalRevenue: parseFloat(bookingStats?.totalRevenue || '0'),
      totalAttendees: parseInt(bookingStats?.totalAttendees || '0', 10),
      avgRating: parseFloat(reviewStats?.avgRating || '0') || 0,
    };
  }

  async getOrganizerEventStats(organizerId: number, eventId: number) {
    const event = await this.eventsRepository.findOne({ where: { id: eventId, organizerId } });
    if (!event) return null;

    const bookingStats = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('COUNT(*)', 'totalBookings')
      .addSelect('COALESCE(SUM(booking.spotsCount), 0)', 'totalAttendees')
      .addSelect('COALESCE(SUM(booking.totalPaid), 0)', 'totalRevenue')
      .where('booking.eventId = :eventId', { eventId })
      .andWhere('booking.status IN (:...statuses)', { statuses: ['confirmed', 'used'] })
      .getRawOne();

    const reviewStats = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(*)', 'reviewCount')
      .where('review.eventId = :eventId', { eventId })
      .getRawOne();

    return {
      event: { id: event.id, title: event.title, date: event.date, capacity: event.capacity },
      totalBookings: parseInt(bookingStats?.totalBookings || '0', 10),
      totalAttendees: parseInt(bookingStats?.totalAttendees || '0', 10),
      totalRevenue: parseFloat(bookingStats?.totalRevenue || '0'),
      spotsAvailable: event.capacity - parseInt(bookingStats?.totalAttendees || '0', 10),
      avgRating: parseFloat(reviewStats?.avgRating || '0') || 0,
      reviewCount: parseInt(reviewStats?.reviewCount || '0', 10),
    };
  }

  async getAdminStats() {
    const totalUsers = await this.usersRepository.count();
    const totalEvents = await this.eventsRepository.count();

    const bookingStats = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('COUNT(*)', 'totalBookings')
      .addSelect('COALESCE(SUM(booking.totalPaid), 0)', 'totalRevenue')
      .andWhere('booking.status IN (:...statuses)', { statuses: ['confirmed', 'used'] })
      .getRawOne();

    const reviewStats = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .getRawOne();

    return {
      totalUsers,
      totalEvents,
      totalBookings: parseInt(bookingStats?.totalBookings || '0', 10),
      totalRevenue: parseFloat(bookingStats?.totalRevenue || '0'),
      avgRating: parseFloat(reviewStats?.avgRating || '0') || 0,
    };
  }

  async getWeeklyTrend() {
    // Last 12 weeks of bookings per day
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7);

    const result = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select("date(booking.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('booking.createdAt >= :startDate', { startDate: twelveWeeksAgo.toISOString() })
      .andWhere('booking.status IN (:...statuses)', { statuses: ['confirmed', 'used'] })
      .groupBy("date(booking.createdAt)")
      .orderBy('date(booking.createdAt)', 'ASC')
      .getRawMany();

    return result;
  }
}
