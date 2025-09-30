import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus } from '@nestjs/common';
import { AadharService } from './aadhar.service';
import { Aadhar } from './aadhar.entity';

@Controller('aadhars')
export class AadharController {
  constructor(private readonly aadharService: AadharService) {}

  @Post()
  async create(@Body() data: Partial<Aadhar>) {
    const result = await this.aadharService.createAadhar(data);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Aadhar record created successfully',
      data: result,
    };
  }

  @Get()
  async findAll() {
    const result = await this.aadharService.getAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'All Aadhar records fetched',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.aadharService.getById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Aadhar record fetched',
      data: result,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Aadhar>) {
    const result = await this.aadharService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Aadhar record updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.aadharService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Aadhar record deleted successfully',
    };
  }
}
