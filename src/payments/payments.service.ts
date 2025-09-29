import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payments.entity';
import { Application } from '../application/application.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
  ) {}

  
  async createPayment(applicationId: number, amount: number): Promise<Payment> {
    const application = await this.applicationRepo.findOneBy({ id: applicationId });
    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    const mockOrderId = `MOCK_ORDER_${Math.floor(Math.random() * 1_000_000)}`;

    const payment = this.paymentRepo.create({
      razorpayOrderId: mockOrderId,
      amount,
      status: PaymentStatus.PENDING,
      application,
    });

    console.log('Saving payment:', payment);

    try {
      const savedPayment = await this.paymentRepo.save(payment);
      console.log('Payment saved successfully:', savedPayment);
      return savedPayment;
    } catch (err) {
      console.error('Payment save failed:', err);
      throw err;
    }
  }

  
  async getPaymentByOrderId(orderId: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { razorpayOrderId: orderId },
      relations: ['application'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with order id ${orderId} not found`);
    }

    return payment;
  }

  
  async getPaymentsByApplication(applicationId: number): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { application: { id: applicationId } },
      relations: ['application'],
    });
  }
}
