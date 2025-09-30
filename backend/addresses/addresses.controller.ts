import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Address } from './addresses.entity';

@Controller('addresses') 
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body() data: Partial<Address>) {
    return this.addressesService.create(data);
  }

  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.addressesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: Partial<Address>) {
    return this.addressesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.addressesService.remove(+id);
  }
}
