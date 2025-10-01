import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Application } from '../application/application.entity';

export enum PaymentStatus { PENDING = 'Pending', COMPLETED = 'Completed', FAILED = 'Failed' }

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'razorpay_order_id' }) razorpayOrderId: string;
  @Column('int') amount: number;
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) status: PaymentStatus;
  @ManyToOne(() => Application, (application) => application.payments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' }) application: Application;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
