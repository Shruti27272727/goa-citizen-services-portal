import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './services.entity';
import { ServicesService } from './services.service';
import { ApplicationModule } from '../application/application.module';

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
})
export class ServicesModule {}
