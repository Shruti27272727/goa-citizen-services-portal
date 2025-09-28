import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, Status } from './application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

  // Get all applications
  findAll() {
    return this.appRepo.find();
  }

  // Get application by ID
  async findOne(id: number) {
    const app = await this.appRepo.findOne({ where: { id } });
    if (!app) throw new NotFoundException(`Application with ID ${id} not found`);
    return app;
  }

  // Citizen applies → status = PENDING
  async create(
  applicationData: Partial<Application> & { citizenId?: number; serviceId?: number },
): Promise<Application> {
  try {
    if (!applicationData.service && applicationData.serviceId) {
      applicationData.service = { id: applicationData.serviceId } as Service;
    }

    if (!applicationData.citizen && applicationData.citizenId) {
      applicationData.citizen = { id: applicationData.citizenId } as Citizen;
    }

    const service = await this.serviceRepo.findOne({ where: { id: applicationData.service.id } });
    if (!service) throw new NotFoundException(`Service with id ${applicationData.service.id} does not exist`);

    const citizen = await this.citizenRepo.findOne({ where: { id: applicationData.citizen.id } });
    if (!citizen) throw new NotFoundException(`Citizen with id ${applicationData.citizen.id} does not exist`);

    const newApp = this.applicationRepo.create({
      ...applicationData,
      service,
      citizen,
      status: Status.PENDING,
      applied_on: new Date(),
    });

    return await this.applicationRepo.save(newApp);

  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}
