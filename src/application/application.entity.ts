import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Officer } from '../officers/officer.entity';
import { Payment } from '../payments/payments.entity';
import { DocumentEntity } from '../documents/documents.entity'; 

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
  @JoinColumn({ name: 'citizenid' })
  citizen: Citizen;

  @ManyToOne(() => Service, (service) => service.applications)
  @JoinColumn({ name: 'serviceid' })
  service: Service;

  @ManyToOne(() => Officer, (officer) => officer.applications, { nullable: true })
  @JoinColumn({ name: 'officerid' })
  officer?: Officer;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ type: 'text', array: true, default: '{}' })
  remarks: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_on: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_on?: Date;

  @OneToMany(() => Payment, (payment) => payment.application)
  payments: Payment[];

  @OneToMany(() => DocumentEntity, (document) => document.application) 
  documents: DocumentEntity[];
}
