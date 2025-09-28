import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Citizen } from '../citizen/citizen.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Citizen, { onDelete: 'CASCADE' })
  citizen: Citizen;

  @Column({ type: 'text' })
  line1: string;

  @Column({ type: 'text' })
  city: string;

  @Column({ type: 'text' })
  pincode: string;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;
}
