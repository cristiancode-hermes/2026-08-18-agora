import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Venue } from '../venues/venue.entity';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
import { Booking } from '../bookings/booking.entity';
import { Review } from '../reviews/review.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 250, unique: true, nullable: false })
  slug: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  time: string;

  @Column({ type: 'int', default: 60 })
  durationMin: number;

  @Column({ type: 'int', nullable: false })
  venueId: number;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'int', nullable: false })
  organizerId: number;

  @Column({ type: 'real', default: 0 })
  price: number;

  @Column({ type: 'int', nullable: false })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  spotsTaken: number;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;

  @Column({ type: 'simple-json', nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @ManyToOne(() => Category, (category) => category.events)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.event)
  reviews: Review[];
}
