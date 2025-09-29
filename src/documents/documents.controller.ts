import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentEntity } from './documents.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() document: Partial<DocumentEntity>) {
    return this.documentsService.create(document);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get('application/:applicationId')
  findByApplication(@Param('applicationId') applicationId: number) {
    return this.documentsService.findByApplication(applicationId);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: number,
    @Body() updateData: Partial<DocumentEntity>,
  ) {
    const updated = await this.documentsService.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  async removeById(@Param('id') id: number) {
    const result = await this.documentsService.removeById(id);
    if (!result) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return { message: `Document with id ${id} deleted successfully` };
  }
}
