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

  // Register Citizen
  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    aadhaar?: string,
    address?: string,
  ) {
    if (!name || !email || !phone || !password) {
      throw new BadRequestException(
        'Name, email, phone, and password are required',
      );
    }

    const existing = await this.citizenRepository.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCitizen = this.citizenRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'citizen',
      aadhaar,
      address,
    });

    await this.citizenRepository.save(newCitizen);

    return {
      message: 'Citizen registered successfully',
      user: {
        id: newCitizen.id,
        name: newCitizen.name,
        email: newCitizen.email,
        phone: newCitizen.phone,
        aadhaar: newCitizen.aadhaar,
        address: newCitizen.address,
        role: newCitizen.role,
        createdAt: newCitizen.createdAt,
      },
    };
  }


// Login Citizen/Officer
async login(email: string, password: string) {
  if (!email || !password) {
    throw new BadRequestException('Email and password are required');
  }

  let user: Citizen | Officer | null = null;
  let role: 'citizen' | 'officer' | 'admin' = 'citizen';
  let departmentId: number | null = null;

  // 1️⃣ Try finding user in Officer table first
  const officer = await this.officerRepository.findOne({ where: { email } });
  if (officer) {
    user = officer;
    role = 'officer';
    departmentId = officer.department_id ?? null;
  } else {
    // 2️⃣ If not found, try Citizen table
    const citizen = await this.citizenRepository.findOne({ where: { email } });
    if (citizen) {
      user = citizen;
      role = citizen.role === 'admin' ? 'admin' : 'citizen';
    }
  }

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // Create JWT
  const token = this.jwtService.sign({
    id: user.id,
    email: user.email,
    role,
    departmentId,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role,
      departmentId,
    },
  };
}




  // Get citizen by email
  async getCitizenByEmail(email: string) {
    const citizen = await this.citizenRepository.findOne({ where: { email } });
    if (!citizen) throw new BadRequestException('Citizen not found');

    return {
      id: citizen.id,
      name: citizen.name,
      email: citizen.email,
      phone: citizen.phone,
      aadhaar: citizen.aadhaar,
      address: citizen.address,
      role: citizen.role,
      createdAt: citizen.createdAt,
    };
  }
}
