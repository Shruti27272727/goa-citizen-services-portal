import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Document } from '../documents/documents.entity';
import { Officer } from '../officers/officer.entity';
import { Payment } from '../payments/payments.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Department } from '../department/department.entity'; 
import { Role } from '../roles/roles.entity';
import { PaymentsService } from 'payments/payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Citizen, Service, Document, Officer, Payment , Role , Department]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, PaymentsService],
})
export class ApplicationModule {}
