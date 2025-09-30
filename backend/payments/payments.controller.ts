import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  async createPayment(
    @Body('applicationId') applicationId: number,
    @Body('amount') amount: number,
  ) {
    return this.paymentsService.createPayment(applicationId, amount);
  }

  @Get('order/:orderId')
  async getPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }

  @Get('application/:applicationId')
  async getPaymentsByApplication(@Param('applicationId') applicationId: number) {
    return this.paymentsService.getPaymentsByApplication(applicationId);
  }
}
