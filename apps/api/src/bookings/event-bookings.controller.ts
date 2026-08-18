import { Controller, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('events')
export class EventBookingsController {
  constructor(private bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':eventId/bookings')
  async createBooking(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: CreateBookingDto,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.createBooking(eventId, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Patch(':eventId/bookings/:id/checkin')
  async checkin(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.checkin(id, eventId, user.id);
  }
}
