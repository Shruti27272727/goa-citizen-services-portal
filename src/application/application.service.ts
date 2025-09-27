import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  // Get all applications with relations
  findAll(): Promise<Application[]> {
    return this.applicationRepo.find({
      relations: ['citizen', 'service', 'officer'],
    });
  }

  // Get a single application by ID
  async findOne(id: number): Promise<Application> {
    const app = await this.applicationRepo.findOne({
      where: { id },
      relations: ['citizen', 'service', 'officer'],
    });

    if (!app) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return app;
  }

  // Create a new application
  create(applicationData: Partial<Application>): Promise<Application> {
    const newApp = this.applicationRepo.create(applicationData);
    return this.applicationRepo.save(newApp);
  }

  // Update an existing application
  async update(id: number, updateData: Partial<Application>): Promise<Application> {
    const result = await this.applicationRepo.update(id, updateData);

    if (result.affected === 0) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return this.findOne(id); // fetch updated application
  }

  // Delete an application
  async remove(id: number): Promise<void> {
    const result = await this.applicationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
  }
}
