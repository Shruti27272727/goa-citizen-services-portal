import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './addresses.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  // Create address (unidirectional, citizen included in data)
  async create(data: Partial<Address>): Promise<Address> {
    const address = this.addressRepository.create(data);
    return this.addressRepository.save(address);
  }

  // Get all addresses
  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({ relations: ['citizen'] });
  }

  // Get one address by ID
  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['citizen'],
    });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  // Update address
  async update(id: number, data: Partial<Address>): Promise<Address> {
    const address = await this.findOne(id);
    Object.assign(address, data);
    return this.addressRepository.save(address);
  }


  async remove(id: number): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Address not found');
  }
}
