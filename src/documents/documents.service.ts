import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './documents.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentsRepo: Repository<DocumentEntity>,
  ) {}

  // Create a new document
  async create(document: Partial<DocumentEntity>) {
    const newDocument = this.documentsRepo.create({
      ...document,
      file_url: document.file_url
        ? Array.isArray(document.file_url)
          ? document.file_url
          : [document.file_url]
        : [],
      doc_type: document.doc_type
        ? Array.isArray(document.doc_type)
          ? document.doc_type
          : [document.doc_type]
        : [],
    });

    return await this.documentsRepo.save(newDocument);
  }

  
  async findAll() {
    return await this.documentsRepo.find({ relations: ['application'] });
  }

  
  async findByApplication(applicationId: number) {
    return await this.documentsRepo.find({
      where: { applicationId },
      relations: ['application'],
    });
  }

  // Update a document by its ID
  async updateById(id: number, updateData: Partial<DocumentEntity>) {
    const updateResult = await this.documentsRepo.update(id, {
      ...updateData,
      // Ensure arrays are always arrays
      file_url: updateData.file_url
        ? Array.isArray(updateData.file_url)
          ? updateData.file_url
          : [updateData.file_url]
        : undefined,
      doc_type: updateData.doc_type
        ? Array.isArray(updateData.doc_type)
          ? updateData.doc_type
          : [updateData.doc_type]
        : undefined,
    });

    if (updateResult.affected && updateResult.affected > 0) {
      return await this.documentsRepo.findOne({
        where: { id },
        relations: ['application'],
      });
    }
    return null; 
  }

  
  async removeById(id: number) {
    const deleteResult = await this.documentsRepo.delete(id);
    return deleteResult.affected && deleteResult.affected > 0;
  }
}
