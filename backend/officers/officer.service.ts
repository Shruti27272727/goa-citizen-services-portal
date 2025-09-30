// src/officers/officer.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Officer } from './officer.entity';

@Injectable()
export class OfficerService {
  constructor(
    @InjectRepository(Officer)
    private readonly officerRepo: Repository<Officer>,
  ) {}

  async findAll(): Promise<Officer[]> {
    return this.officerRepo.find();
  }

  async findOne(id: number): Promise<Officer> {
    const officer = await this.officerRepo.findOneBy({ id });
    if (!officer) throw new NotFoundException(`Officer with ID ${id} not found`);
    return officer;
  }

  async create(data: Partial<Officer>): Promise<Officer> {
    const officer = this.officerRepo.create(data);
    return this.officerRepo.save(officer);
  }

  async update(id: number, data: Partial<Officer>): Promise<Officer> {
    const result = await this.officerRepo.update(id, data);
    if (result.affected === 0) throw new NotFoundException(`Officer with ID ${id} not found`);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.officerRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Officer with ID ${id} not found`);
  }
}
