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

  // Create a new department
  async create(departmentData: Partial<Department>): Promise<Department> {
    const department = this.departmentRepo.create(departmentData);
    return this.departmentRepo.save(department);
  }

  // Get all departments
  async findAll(): Promise<Department[]> {
    return this.departmentRepo.find();
  }

  // Get a department by ID with error handling
  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepo.findOneBy({ id });
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return department;
  }

  // Update a department with error handling
  async update(id: number, updateData: Partial<Department>): Promise<Department> {
    const department = await this.findOne(id); // Will throw error if not found
    Object.assign(department, updateData);
    return this.departmentRepo.save(department);
  }

  // Delete a department with error handling
  async remove(id: number): Promise<void> {
    const department = await this.findOne(id); // Will throw error if not found
    await this.departmentRepo.delete(department.id);
  }
}
