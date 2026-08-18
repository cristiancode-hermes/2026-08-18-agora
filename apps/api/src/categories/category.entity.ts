import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from '../events/event.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  slug: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 7, default: '#2D5A3D' })
  color: string;

  @OneToMany(() => Event, (event) => event.category)
  events: Event[];
}
