import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepo: Repository<Document>,
  ) {}

  
  async create(document: Partial<Document>) {
    const newDocument = this.documentsRepo.create(document);
    return await this.documentsRepo.save(newDocument);
  }

  
  async findAll() {
    return await this.documentsRepo.find({ relations: ['application'] });
  }

 
 async findByApplication(applicationId: number) {
  return await this.documentsRepo.find({
    where: { application: { id: applicationId } }, 
    relations: ['application'],
  });
}

  

  async updateById(id: number, updateData: Partial<Document>) {
    const document = await this.documentsRepo.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    Object.assign(document, updateData);
    return await this.documentsRepo.save(document);
  }

 
  async removeById(id: number) {
    const deleteResult = await this.documentsRepo.delete(id);
    return deleteResult.affected && deleteResult.affected > 0;
  }
}
