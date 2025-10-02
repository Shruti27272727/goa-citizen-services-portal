import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Document } from '../documents/documents.entity';
import { PaymentsService } from '../payments/payments.service';
import { Officer } from '../officers/officer.entity';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,

    @InjectRepository(Citizen)
    private readonly citizenRepo: Repository<Citizen>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,

    @InjectRepository(Officer)
    private readonly officerRepo: Repository<Officer>,

    private readonly paymentsService: PaymentsService,
  ) { }

  async createWithDocument(
    citizenId: number,
    serviceId: number | string,
    files: Express.Multer.File[] = [],
  ) {

    const citizen = await this.citizenRepo.findOne({ where: { id: citizenId } });
    if (!citizen) throw new NotFoundException('Citizen not found');

    const serviceIdNum = Number(serviceId);
    if (isNaN(serviceIdNum) || serviceIdNum <= 0)
      throw new BadRequestException('Invalid serviceId');

    const service = await this.serviceRepo.findOne({ where: { id: serviceIdNum } });
    if (!service) throw new NotFoundException('Service not found');


    const application = this.applicationRepo.create({
      status: ApplicationStatus.PENDING,
      citizen,
      service,
    });
    const savedApp = await this.applicationRepo.save(application);


    const uploadDir = join(__dirname, '../../uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    for (const file of files) {
      const doc = this.documentRepo.create({
        fileName: file.originalname,
        filePath: file.path || file.filename,
        application: savedApp,
      });
      await this.documentRepo.save(doc);
    }


    const amount = service.fee || 1000;
    const payment = await this.paymentsService.createPayment(savedApp.id, amount);


    const applicationWithRelations = await this.applicationRepo.findOne({
      where: { id: savedApp.id },
      relations: ['service', 'documents', 'officer'],
    });

    return {
      application: applicationWithRelations,
      payment: {
        id: payment.id,
        order: {
          id: payment.razorpayOrderId,
          amount: payment.amount,
          currency: 'INR',
        },
      },
    };
  }

  async getApplicationsByCitizen(citizenId: number) {
    if (!citizenId) throw new BadRequestException('Citizen ID is required');

    return this.applicationRepo.find({
      where: { citizen: { id: citizenId } },
      relations: ['service', 'documents', 'officer'],
      order: { appliedOn: 'DESC' },
    });
  }

  async getUserHistory(citizenId: number): Promise<Application[]> {
    if (!citizenId) throw new BadRequestException('Citizen ID is required');


    return this.applicationRepo.find({
      where: { citizen: { id: citizenId } },
      relations: ['service', 'documents', 'officer'],
      order: { appliedOn: 'DESC' },
    });
  }

  async getPendingApplications(): Promise<Application[]> {
    return this.applicationRepo.find({
      where: { status: ApplicationStatus.PENDING },
      relations: ['service', 'documents', 'officer'],
      order: { appliedOn: 'DESC' },
    });
  }

  async approveApplication(applicationId: number, officerId: number, remarks: string): Promise<Application> {
    return this.changeApplicationStatus(applicationId, officerId, ApplicationStatus.APPROVED, remarks);
  }

  async rejectApplication(applicationId: number, officerId: number, remarks: string): Promise<Application> {
    return this.changeApplicationStatus(applicationId, officerId, ApplicationStatus.REJECTED, remarks);

  }

  async changeApplicationStatus(applicationId: number, officerId: number, status: ApplicationStatus, remarks: string): Promise<Application> {
    const application = await this.applicationRepo.findOne({
      where: { id: applicationId },
      relations: ['officer', 'service', 'documents', 'citizen'],
    });
    if (!application) throw new NotFoundException('Application not found');

    const officer = await this.officerRepo.findOne({ where: { id: officerId } });
    if (!officer) throw new NotFoundException('Officer not found');

    application.status = status;
    application.completedOn = new Date();
    application.officer = officer;
    application.remarks = remarks;
    return await this.applicationRepo.save(application);
  }

}
