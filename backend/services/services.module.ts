import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './services.entity';
import { ServicesService } from './services.service';
import { ApplicationModule } from '../application/application.module';
import { ServicesController } from './services.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    forwardRef(() => ApplicationModule),
  ],
  providers: [ServicesService],
  exports: [
    ServicesService,
    TypeOrmModule, 
  ],
  controllers: [ServicesController],
})
export class ServicesModule {}
