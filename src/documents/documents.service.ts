import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepo: Repository<Document>,
  ) {}

  create(document: Partial<Document>) {
    const newDocument = this.documentsRepo.create(document);
    return this.documentsRepo.save(newDocument);
  }

  findAll() {
    return this.documentsRepo.find({ relations: ['application'] });
  }

  findOne(applicationId: number) {
    return this.documentsRepo.findOne({
      where: { applicationId },
      relations: ['application'],
    });
  }

  update(applicationId: number, updateData: Partial<Document>) {
    return this.documentsRepo.update({ applicationId }, updateData);
  }

  remove(applicationId: number) {
    return this.documentsRepo.delete({ applicationId });
  }
}
