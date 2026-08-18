import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Get('organizer')
  async getOrganizerStats(@CurrentUser() user: any) {
    return this.statsService.getOrganizerStats(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Get('organizer/:eventId')
  async getOrganizerEventStats(
    @CurrentUser() user: any,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.statsService.getOrganizerEventStats(user.id, eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  async getAdminStats() {
    return this.statsService.getAdminStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/weekly-trend')
  async getWeeklyTrend() {
    return this.statsService.getWeeklyTrend();
  }
}
