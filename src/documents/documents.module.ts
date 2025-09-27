import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './documents.entity';
import { Application } from '../application/application.entity'; // ✅ Correct path

@Module({
  imports: [TypeOrmModule.forFeature([Document, Application])],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
