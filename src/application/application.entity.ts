import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Officer } from '../officers/officer.entity';

export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'application' })
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Citizen, (citizen) => citizen.applications)
  @JoinColumn({ name: 'citizenid' }) // matches DB
  citizen: Citizen;

  @ManyToOne(() => Service, (service) => service.applications)
  @JoinColumn({ name: 'serviceid' }) // matches DB
  service: Service;

  @ManyToOne(() => Officer, (officer) => officer.applications, { nullable: true })
  @JoinColumn({ name: 'officerid' }) // matches DB
  officer?: Officer;

  @Column({ type: 'enum', enum: Status }) // removed default
  status: Status;

  @Column({ type: 'text', array: true, default: '{}' })
  remarks: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_on: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_on?: Date;
}
