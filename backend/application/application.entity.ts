import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Officer } from '../officers/officer.entity';
import { Payment } from '../payments/payments.entity';
import { Document } from '../documents/documents.entity';

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
  @JoinColumn({ name: 'citizen_id' })
  citizen: Citizen;

  @ManyToOne(() => Service, (service) => service.applications)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => Officer, (officer) => officer.applications, { nullable: true })
  @JoinColumn({ name: 'officer_id' })
  officer?: Officer;

  @Column({ type: 'character varying', length: 20, default: Status.PENDING })
  status: Status;

  
  @Column({ type: 'text', array: true, nullable: true })
  remarks: string[];
@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
applied_on: Date;


  @Column({ type: 'timestamp', nullable: true })
  completed_on?: Date;

  @OneToMany(() => Payment, (payment) => payment.application)
  payments: Payment[];

  @OneToMany(() => Document, (document) => document.application)
  documents: Document[];
}
