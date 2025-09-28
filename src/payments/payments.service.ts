import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payments.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}


  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentRepository.create(paymentData);
    return this.paymentRepository.save(payment);
  }


  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findOne(applicationId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOneBy({ applicationId });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${applicationId} not found`);
    }
    return payment;
  }


  async update(applicationId: number, updateData: Partial<Payment>): Promise<Payment> {
    const payment = await this.findOne(applicationId); // throws if not found
    const updatedPayment = this.paymentRepository.merge(payment, updateData);
    return this.paymentRepository.save(updatedPayment);
  }

 
  async delete(applicationId: number): Promise<void> {
    const payment = await this.findOne(applicationId); 
    await this.paymentRepository.delete(payment.applicationId);
  }
}
