import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  
  async create(departmentData: Partial<Department>): Promise<Department> {
    const department = this.departmentRepo.create(departmentData);
    return this.departmentRepo.save(department);
  }

  
  async findAll(): Promise<Department[]> {
    return this.departmentRepo.find();
  }

 
  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepo.findOneBy({ id });
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return department;
  }


  async update(id: number, updateData: Partial<Department>): Promise<Department> {
    const department = await this.findOne(id);
    Object.assign(department, updateData);
    return this.departmentRepo.save(department);
  }

  
  async remove(id: number): Promise<void> {
    const department = await this.findOne(id); 
    await this.departmentRepo.delete(department.id);
  }
}
