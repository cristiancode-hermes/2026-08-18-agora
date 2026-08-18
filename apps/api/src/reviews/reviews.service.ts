import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Booking } from '../bookings/booking.entity';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async findByEvent(eventId: number) {
    const reviews = await this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .select([
        'review',
        'user.id', 'user.username', 'user.avatar',
      ])
      .where('review.eventId = :eventId', { eventId })
      .orderBy('review.createdAt', 'DESC')
      .getMany();

    const stats = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(*)', 'count')
      .where('review.eventId = :eventId', { eventId })
      .getRawOne();

    return {
      reviews,
      avgRating: parseFloat(stats?.avgRating || '0') || 0,
      count: parseInt(stats?.count || '0', 10),
    };
  }

  async create(eventId: number, userId: number, dto: CreateReviewDto) {
    // Check user has a 'used' booking for this event
    const booking = await this.bookingsRepository.findOne({
      where: { userId, eventId, status: 'used' },
    });

    if (!booking) {
      throw new BadRequestException('You can only review events you have attended');
    }

    // One review per user per event
    const existing = await this.reviewsRepository.findOne({
      where: { userId, eventId },
    });

    if (existing) {
      throw new BadRequestException('You have already reviewed this event');
    }

    const review = this.reviewsRepository.create({
      userId,
      eventId,
      rating: dto.rating,
      comment: dto.comment,
    } as any);

    return this.reviewsRepository.save(review);
  }

  async delete(reviewId: number, userId: number, userRole: string) {
    const review = await this.reviewsRepository.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (userRole !== 'admin' && review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewsRepository.remove(review);
    return { message: 'Review deleted' };
  }
}
