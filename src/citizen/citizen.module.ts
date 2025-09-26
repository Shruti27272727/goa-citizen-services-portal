import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citizen } from './citizen.entity';
import { CitizenService } from './citizen.service';
import { CitizenController } from './citizen.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Citizen])],
  providers: [CitizenService],
  controllers: [CitizenController],
})
export class CitizenModule {}
