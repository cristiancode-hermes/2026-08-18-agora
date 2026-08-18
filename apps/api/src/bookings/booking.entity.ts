import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  eventId: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'int', default: 1 })
  spotsCount: number;

  @Column({ type: 'real', default: 0 })
  totalPaid: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  qrToken: string;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
