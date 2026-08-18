import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './venue.entity';
import { CreateVenueDto } from './dto/venue.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async findAll() {
    return this.venuesRepository.find();
  }

  async findOne(id: number) {
    const venue = await this.venuesRepository.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }
    return venue;
  }

  async create(createVenueDto: CreateVenueDto) {
    const venue = this.venuesRepository.create(createVenueDto as any);
    return this.venuesRepository.save(venue);
  }
}
