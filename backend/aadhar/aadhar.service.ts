import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aadhar } from './aadhar.entity';

@Injectable()
export class AadharService {
  constructor(
    @InjectRepository(Aadhar)
    private readonly aadharRepository: Repository<Aadhar>,
  ) {}

  // Create a new Aadhar record
  async createAadhar(data: Partial<Aadhar>): Promise<Aadhar> {
    try {
      const aadhar = this.aadharRepository.create(data);
      return await this.aadharRepository.save(aadhar);
    } catch (error) {
      console.error('Aadhar creation error:', error);
      throw error;
    }
  }

  async getAll(): Promise<Aadhar[]> {
    return this.aadharRepository.find();
  }

  async getById(id: number): Promise<Aadhar> {
    const aadhar = await this.aadharRepository.findOneBy({ citizen_id: id });
    if (!aadhar) {
      throw new NotFoundException(`Aadhar with id ${id} not found`);
    }
    return aadhar;
  }

  async update(id: number, data: Partial<Aadhar>): Promise<Aadhar> {
    const result = await this.aadharRepository.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`Aadhar with id ${id} not found`);
    }
    return this.getById(id); // ✅ Make sure this line is inside update method
  }

  async remove(id: number): Promise<void> {
    const result = await this.aadharRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Aadhar with id ${id} not found`);
    }
  }
}
