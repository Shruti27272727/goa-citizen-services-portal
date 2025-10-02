// src/officers/officer.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { Officer } from './officer.entity';

@Controller('officers')
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  @Get()
  findAll(): Promise<Officer[]> {
    return this.officerService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Officer> {
    return this.officerService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Officer>): Promise<Officer> {
    return this.officerService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: Partial<Officer>): Promise<Officer> {
    return this.officerService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.officerService.remove(id);
  }
}
