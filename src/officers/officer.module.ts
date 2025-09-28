import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Officer } from './officer.entity';
import { OfficerService } from './officer.service';
import { OfficerController } from './officer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Officer])],
  providers: [OfficerService],
  controllers: [OfficerController],
  exports: [
    OfficerService,
    TypeOrmModule, // ✅ export TypeOrmModule so OfficerRepository is available
  ],
})
export class OfficerModule {}
