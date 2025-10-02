import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Officer } from '../officers/officer.entity';
import { Document } from '../documents/documents.entity';
import { Payment } from '../payments/payments.entity';

export enum ApplicationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity({ name: 'applications' })
export class Application {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 10,
    default: ApplicationStatus.PENDING
  })
  status: ApplicationStatus;

  @Column({ type: 'text', name: 'remarks', nullable: true })
  remarks: string;

  @CreateDateColumn({ name: 'applied_on', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  appliedOn: Date;

  @Column({ name: 'completed_on', type: 'timestamp', nullable: true })
  completedOn?: Date;

  @ManyToOne(() => Citizen, (citizen) => citizen.applications, { nullable: false })
  @JoinColumn({ name: 'citizen_id' })
  citizen: Citizen;

  @ManyToOne(() => Service, (service) => service.applications, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => Officer, (officer) => officer.applications, { nullable: true })
  @JoinColumn({ name: 'officer_id' })
  officer?: Officer;

  @OneToMany(() => Document, (document) => document.application, { cascade: true })
  documents: Document[];

  @OneToMany(() => Payment, (payment) => payment.application, { cascade: true })
  payments: Payment[];
}
