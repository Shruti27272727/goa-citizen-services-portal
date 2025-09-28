import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, Status } from './application.entity';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Officer } from '../officers/officer.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
    @InjectRepository(Citizen)
    private readonly citizenRepo: Repository<Citizen>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Officer)
    private readonly officerRepo: Repository<Officer>,
  ) {}

  // Create a new application
  async create(body: { citizenId: number; serviceId: number; remarks: string[] }): Promise<Application> {
    const { citizenId, serviceId, remarks } = body;

    const citizen = await this.citizenRepo.findOne({ where: { id: citizenId } });
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });

    if (!citizen || !service) {
      throw new NotFoundException('Citizen or Service not found');
    }

    const application = this.appRepo.create({
      citizen,
      service,
      remarks,
      status: Status.PENDING,
    });

    return this.appRepo.save(application);
  }

  // Update status by officer
  async updateStatus(appId: number, officerId: number, status: Status): Promise<Application> {
    const application = await this.appRepo.findOne({ where: { id: appId } });
    if (!application) throw new NotFoundException('Application not found');

    const officer = await this.officerRepo.findOne({ where: { id: officerId } });
    if (!officer) throw new NotFoundException('Officer not found');

    application.status = status;
    application.officer = officer;
    application.completed_on = new Date();

    return this.appRepo.save(application);
  }

  // Get applications by citizen
  async getApplicationsByCitizen(citizenId: number): Promise<Application[]> {
    return this.appRepo.find({
      where: { citizen: { id: citizenId } },
      relations: ['service', 'officer'],
    });
  }

  // Get pending applications
  async getPendingApplications(): Promise<Application[]> {
    return this.appRepo.find({
      where: { status: Status.PENDING },
      relations: ['citizen', 'service'],
    });
  }
}
