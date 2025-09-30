import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

 
  async create(role_type: string): Promise<Role> {
    const role = this.rolesRepository.create({ role_type });
    return this.rolesRepository.save(role);
  }

 
  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

 
  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  
  async update(id: number, role_type: string): Promise<Role> {
    const role = await this.findOne(id);
    role.role_type = role_type;
    return this.rolesRepository.save(role);
  }

 
  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.rolesRepository.remove(role);
  }
}
