import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Citizen } from './citizen.entity';

@Injectable()
export class CitizenService {
  constructor(
    @InjectRepository(Citizen)
    private readonly citizenRepository: Repository<Citizen>,
  ) {}

  async findAll(): Promise<Citizen[]> {
    return this.citizenRepository.find();
  }

  async findOne(id: number): Promise<Citizen | null> {
    return this.citizenRepository.findOneBy({ id });
  }

  async create(citizenData: Partial<Citizen>): Promise<Citizen> {
    const citizen = this.citizenRepository.create(citizenData);
    return this.citizenRepository.save(citizen);
  }

  async update(id: number, updateData: Partial<Citizen>): Promise<Citizen | null> {
    await this.citizenRepository.update(id, updateData);
    return this.citizenRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.citizenRepository.delete(id);
  }
}
