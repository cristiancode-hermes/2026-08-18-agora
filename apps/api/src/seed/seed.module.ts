import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Venue } from '../venues/venue.entity';
import { Category } from '../categories/category.entity';
import { Event } from '../events/event.entity';
import { Booking } from '../bookings/booking.entity';
import { Review } from '../reviews/review.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Venue, Category, Event, Booking, Review])],
  providers: [SeedService],
})
export class SeedModule {}
