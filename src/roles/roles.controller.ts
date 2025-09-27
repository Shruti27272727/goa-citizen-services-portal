import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body('role_type') role_type: string): Promise<Role> {
    return this.rolesService.create(role_type);
  }

  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Role> {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body('role_type') role_type: string): Promise<Role> {
    return this.rolesService.update(+id, role_type);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.rolesService.remove(+id);
  }
}
