import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './addresses.entity';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Citizen } from '../citizen/citizen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Citizen])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
