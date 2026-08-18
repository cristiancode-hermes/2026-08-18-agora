import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto, UpdateEventDto, UpdateEventStatusDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async findAll(query: {
    category?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .select([
        'event',
        'venue.id', 'venue.name', 'venue.address',
        'category.id', 'category.name', 'category.slug', 'category.icon', 'category.color',
        'organizer.id', 'organizer.username', 'organizer.avatar',
      ]);

    if (query.category) {
      qb.andWhere('category.slug = :category', { category: query.category });
    }
    if (query.date) {
      qb.andWhere('event.date = :date', { date: query.date });
    }
    if (query.minPrice !== undefined) {
      qb.andWhere('event.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice !== undefined) {
      qb.andWhere('event.price <= :maxPrice', { maxPrice: query.maxPrice });
    }
    if (query.search) {
      qb.andWhere('event.title LIKE :search', { search: `%${query.search}%` });
    }

    qb.orderBy('event.date', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findFeatured() {
    return this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .select([
        'event',
        'venue.id', 'venue.name', 'venue.address',
        'category.id', 'category.name', 'category.slug', 'category.icon', 'category.color',
        'organizer.id', 'organizer.username', 'organizer.avatar',
      ])
      .where('event.status = :status', { status: 'published' })
      .orderBy('event.spotsTaken', 'DESC')
      .limit(3)
      .getMany();
  }

  async findOne(id: number) {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .select([
        'event',
        'venue.id', 'venue.name', 'venue.address', 'venue.lat', 'venue.lng', 'venue.capacity',
        'category.id', 'category.name', 'category.slug', 'category.icon', 'category.color',
        'organizer.id', 'organizer.username', 'organizer.avatar',
      ])
      .where('event.id = :id', { id })
      .getOne();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const spotsAvailable = await this.getSpotsAvailable(id);
    return { ...event, spotsAvailable };
  }

  async create(createEventDto: CreateEventDto, organizerId: number) {
    const slug = this.slugify(createEventDto.title);
    const uniqueSlug = await this.ensureUniqueSlug(slug);

    const event = this.eventsRepository.create({
      ...createEventDto,
      slug: uniqueSlug,
      organizerId,
      venueId: createEventDto.venueId,
      categoryId: createEventDto.categoryId,
      status: 'draft',
    } as any);

    return this.eventsRepository.save(event);
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (updateEventDto.title) {
      event.slug = await this.ensureUniqueSlug(this.slugify(updateEventDto.title));
    }

    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async updateStatus(id: number, updateEventStatusDto: UpdateEventStatusDto) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    event.status = updateEventStatusDto.status;
    return this.eventsRepository.save(event);
  }

  async getSpotsAvailable(eventId: number): Promise<number> {
    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) return 0;

    const result = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoin('event.bookings', 'booking', 'booking.status IN (:...statuses)', {
        statuses: ['pending', 'confirmed'],
      })
      .select('COALESCE(SUM(booking.spotsCount), 0)', 'booked')
      .where('event.id = :eventId', { eventId })
      .getRawOne();

    const booked = parseInt(result?.booked || '0', 10);
    return event.capacity - booked;
  }

  private async ensureUniqueSlug(slug: string): Promise<string> {
    let candidate = slug;
    let counter = 1;
    while (true) {
      const existing = await this.eventsRepository.findOne({ where: { slug: candidate } });
      if (!existing) return candidate;
      candidate = `${slug}-${counter}`;
      counter++;
    }
  }
}
