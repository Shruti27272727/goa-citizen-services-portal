import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { CitizenModule } from '../citizen/citizen.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    CitizenModule,
    ServicesModule, 
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
