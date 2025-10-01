import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Citizen } from '../citizen/citizen.entity';
import { Officer } from '../officers/officer.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Citizen)
    private citizenRepository: Repository<Citizen>,
    @InjectRepository(Officer)
    private officerRepository: Repository<Officer>,
    private jwtService: JwtService,
  ) {}

  // ---------------- Citizen Registration ----------------
  async register(email: string, contact: string, password: string) {
    if (!email || !contact || !password) {
      throw new BadRequestException(
        'Email, phone/Aadhaar, and password are required',
      );
    }

    // Check if email already exists in citizens
    const existing = await this.citizenRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCitizen = this.citizenRepository.create({
      email,
      phone: contact,
      password: hashedPassword,
      role: 'citizen', // default role
    });

    await this.citizenRepository.save(newCitizen);

    return {
      message: 'Citizen registered successfully',
      user: {
        id: newCitizen.id,
        email: newCitizen.email,
        phone: newCitizen.phone,
        createdAt: newCitizen.createdAt,
        role: newCitizen.role,
      },
    };
  }

  // ---------------- Login (Citizen / Officer / Admin) ----------------
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    let user: Citizen | Officer | null = null;
    let role: 'citizen' | 'officer' | 'admin' = 'citizen';

    // 1️⃣ Check if user exists as citizen (including admin)
    user = await this.citizenRepository.findOne({ where: { email } });
    if (user) {
      role = user.role === 'admin' ? 'admin' : 'citizen';
    }

    // 2️⃣ If not citizen, check officer
    if (!user) {
      user = await this.officerRepository.findOne({ where: { email } });
      role = 'officer';
    }

    // 3️⃣ If still not found
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 4️⃣ Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    // 5️⃣ Generate JWT including role
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role,
    });

    return {
      id: user.id,
      email: user.email,
      token,
      role, // frontend will redirect based on this
    };
  }
}
