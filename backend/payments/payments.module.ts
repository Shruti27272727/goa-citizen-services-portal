
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './payments.entity';
import { Application } from '../application/application.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Application]), 
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
