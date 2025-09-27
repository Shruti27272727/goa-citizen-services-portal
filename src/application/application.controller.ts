import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Get()
  getAll(): Promise<Application[]> {
    return this.appService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Application> {
    return this.appService.findOne(id);
  }

  @Post()
  create(@Body() appData: Partial<Application>): Promise<Application> {
    return this.appService.create(appData);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Application>,
  ): Promise<Application> {
    return this.appService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.appService.remove(id);
  }
}
