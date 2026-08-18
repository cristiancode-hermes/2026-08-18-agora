import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Event } from '../events/event.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { EventBookingsController } from './event-bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Event])],
  controllers: [BookingsController, EventBookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
