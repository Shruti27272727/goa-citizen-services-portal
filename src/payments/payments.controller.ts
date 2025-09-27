import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payments.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Create a new payment */
  @Post()
  async create(@Body() paymentData: Partial<Payment>): Promise<Payment> {
    return this.paymentsService.create(paymentData);
  }

  /** Get all payments */
  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  /** Get a payment by applicationId */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  /** Update a payment by applicationId */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Payment>,
  ): Promise<Payment> {
    return this.paymentsService.update(id, updateData);
  }

  /** Delete a payment by applicationId */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.paymentsService.delete(id);
    return { message: `Payment with ID ${id} deleted successfully` };
  }
}
