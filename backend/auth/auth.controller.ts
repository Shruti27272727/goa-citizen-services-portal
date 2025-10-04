import { Controller, Post, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  aadhaar?: string;
  address?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { name, email, phone, password, aadhaar, address } = body;
    return this.authService.register(name, email, phone, password, aadhaar, address);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Get('citizen')
  async getCitizen(@Query('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    return this.authService.getCitizenByEmail(email);
  }
}
