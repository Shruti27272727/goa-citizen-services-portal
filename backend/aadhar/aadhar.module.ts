import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aadhar } from './aadhar.entity';
import { AadharService } from './aadhar.service';
import { AadharController } from './aadhar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aadhar])],
  controllers: [AadharController],
  providers: [AadharService],
})
export class AadharModule {}
