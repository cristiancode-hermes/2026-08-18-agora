import { Controller, Get, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async getMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.getMyBookings(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/ticket')
  async getTicket(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.getTicket(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.cancel(id, user.id);
  }
}
