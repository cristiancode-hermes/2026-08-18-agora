import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from '../events/event.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  address: string;

  @Column({ type: 'real', nullable: true })
  lat: number;

  @Column({ type: 'real', nullable: true })
  lng: number;

  @Column({ type: 'int', default: 100 })
  capacity: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Event, (event) => event.venue)
  events: Event[];
}
