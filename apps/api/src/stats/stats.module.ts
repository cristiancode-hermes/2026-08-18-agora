import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { Booking } from '../bookings/booking.entity';
import { Review } from '../reviews/review.entity';
import { User } from '../users/user.entity';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Booking, Review, User])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
