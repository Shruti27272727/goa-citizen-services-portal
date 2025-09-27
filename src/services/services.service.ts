import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Service } from './services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    private readonly dataSource: DataSource, // for raw queries
  ) {}

  // Create a service with validation of department_id
  async create(data: Partial<Service>): Promise<Service> {
    if (!data.department_id) {
      throw new BadRequestException('department_id is required');
    }

    // Check if department exists in the database
    const departmentExists = await this.dataSource.query(
      `SELECT id FROM departments WHERE id = $1`,
      [data.department_id],
    );

    if (!departmentExists.length) {
      throw new NotFoundException(`Department with id ${data.department_id} does not exist`);
    }

    const service = this.serviceRepo.create({
      department_id: data.department_id,
      name: data.name,
      description: data.description,
      fee: data.fee,
    });

    return await this.serviceRepo.save(service);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepo.find();
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException(`Service with id ${id} not found`);
    return service;
  }

  async update(id: number, data: Partial<Service>): Promise<Service> {
    await this.serviceRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.serviceRepo.delete(id);
    return { deleted: (result.affected ?? 0) > 0 };
  }
}
