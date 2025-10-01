import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Document } from '../documents/documents.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,

    @InjectRepository(Citizen)
    private citizenRepo: Repository<Citizen>,

    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,

    @InjectRepository(Document)
    private documentRepo: Repository<Document>,

    private paymentsService: PaymentsService,
  ) {}

  async createWithDocument(
    citizenId: number,
    serviceId: number,
    remarks: string[],
    files: Express.Multer.File[],
  ) {
    const citizen = await this.citizenRepo.findOne({ where: { id: citizenId } });
    if (!citizen) throw new NotFoundException(`Citizen not found`);

    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException(`Service not found`);

    const application = this.applicationRepo.create({
      status: ApplicationStatus.PENDING,
      remarks,
      citizen,
      service,
    });

    const savedApp = await this.applicationRepo.save(application);

    if (files?.length) {
      for (const file of files) {
        const doc = this.documentRepo.create({
          fileName: file.originalname,
          filePath: file.path || '',
          application: savedApp,
        });
        await this.documentRepo.save(doc);
      }
    }

    const amount = service.fee || 1000;
    const payment = await this.paymentsService.createPayment(savedApp.id, amount);

    return {
      application: savedApp,
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
      relations: ['service', 'documents'],
      order: { appliedOn: 'DESC' },
    });
  }
} 
