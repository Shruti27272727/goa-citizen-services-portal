import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { Citizen } from './citizen.entity';

@Controller('citizen')
export class CitizenController {
  constructor(private readonly citizenService: CitizenService) {}

  @Get()
  findAll(): Promise<Citizen[]> {
    return this.citizenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Citizen | null> {
    return this.citizenService.findOne(id);
  }

  @Post()
  create(@Body() citizenData: Partial<Citizen>): Promise<Citizen> {
    return this.citizenService.create(citizenData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<Citizen>): Promise<Citizen | null> {
    return this.citizenService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.citizenService.remove(id);
  }
}
