import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Document } from '../documents/documents.entity';
import { PaymentsService } from '../payments/payments.service';
import { Payment } from '../payments/payments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Citizen, Service, Document, Payment])],
  controllers: [ApplicationController],
  providers: [ApplicationService, PaymentsService],
})
export class ApplicationModule {}
