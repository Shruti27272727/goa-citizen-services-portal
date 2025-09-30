
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, Status } from './application.entity';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Document } from '../documents/documents.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(Citizen)
    private readonly citizenRepository: Repository<Citizen>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async createWithDocument(
    citizenId: number,
    serviceId: number,
    remarks: string[] = [],
    documentFiles?: Express.Multer.File[],
  ) {
  
    const citizen = await this.citizenRepository.findOne({ where: { id: citizenId } });
    if (!citizen) throw new NotFoundException('Citizen not found');

  
    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    
    const application = this.applicationRepository.create({
      citizen,
      service,
      status: Status.PENDING,
      remarks,
    });

    const savedApplication = await this.applicationRepository.save(application);

    if (documentFiles && documentFiles.length > 0) {
      const documents = documentFiles.map(file =>
        this.documentRepository.create({
          fileName: file.originalname,
          filePath: file.path || '',
          application: savedApplication,
        }),
      );
      await this.documentRepository.save(documents);
    }

    return savedApplication;
  }

 
  async getApplicationsByCitizen(citizenId: number) {
    if (!citizenId) throw new BadRequestException('Citizen ID is required');

    const citizen = await this.citizenRepository.findOne({ where: { id: citizenId } });
    if (!citizen) throw new NotFoundException('Citizen not found');

  
    return this.applicationRepository.find({
      where: { citizen: { id: citizenId } },
      relations: ['service', 'documents'],
      order: { applied_on: 'DESC' }, 
    });
  }
}
