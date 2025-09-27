import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './documents.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() document: Partial<Document>) {
    return this.documentsService.create(document);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':applicationId')
  findOne(@Param('applicationId') applicationId: number) {
    return this.documentsService.findOne(applicationId);
  }

  @Put(':applicationId')
  update(@Param('applicationId') applicationId: number, @Body() updateData: Partial<Document>) {
    return this.documentsService.update(applicationId, updateData);
  }

  @Delete(':applicationId')
  remove(@Param('applicationId') applicationId: number) {
    return this.documentsService.remove(applicationId);
  }
}
