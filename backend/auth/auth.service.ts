import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Citizen } from '../citizen/citizen.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Citizen)
    private citizenRepository: Repository<Citizen>,
    private jwtService: JwtService,
  ) {}

  // Registration
  async register(email: string, contact: string, password: string) {
    if (!email || !contact || !password) {
      throw new BadRequestException('Email, phone/Aadhaar, and password are required');
    }

    const existing = await this.citizenRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCitizen = this.citizenRepository.create({ email, phone: contact, password: hashedPassword });

    await this.citizenRepository.save(newCitizen);

    return {
      message: 'User registered successfully',
      user: {
        id: newCitizen.id,
        email: newCitizen.email,
        phone: newCitizen.phone,
        createdAt: newCitizen.createdAt,
      },
    };
  }

  // Login
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.citizenRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      token,
      role: 'citizen',
    };
  }
}
