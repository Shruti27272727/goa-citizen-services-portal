import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  ParseIntPipe, 
  BadRequestException 
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}


  @Post('create')
  async createPayment(
    @Body('applicationId', ParseIntPipe) applicationId: number,
    @Body('amount', ParseIntPipe) amount: number, 
  ) {
    if (!applicationId || !amount) {
      throw new BadRequestException('Application ID and amount are required');
    }
    return this.paymentsService.createPayment(applicationId, amount);
  }

 
  @Get('order/:orderId')
  async getPayment(@Param('orderId') orderId: string) {
    if (!orderId) throw new BadRequestException('Order ID is required');
    return this.paymentsService.getPaymentByOrderId(orderId);
  }

 
  @Get('application/:applicationId')
  async getPaymentsByApplication(
    @Param('applicationId', ParseIntPipe) applicationId: number,
  ) {
    if (!applicationId) throw new BadRequestException('Application ID is required');
    return this.paymentsService.getPaymentsByApplication(applicationId);
  }
}
