import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Document } from '../documents/documents.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Citizen, Service, Document]), 
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
