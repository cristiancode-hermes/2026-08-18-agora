import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('events/:eventId/reviews')
  async findByEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.reviewsService.findByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('events/:eventId/reviews')
  async create(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.create(eventId, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('reviews/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.delete(id, user.id, user.role);
  }
}
