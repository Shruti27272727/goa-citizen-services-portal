import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface RegisterDto {
  email: string;
  phone?: string;
  aadhaar?: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registration endpoint
  @Post('register')
  async register(@Body() body: RegisterDto) {
    console.log('Received registration body:', body);

    const { email, phone, aadhaar, password } = body;

    // Validate required fields
    if (!email || !password || (!phone && !aadhaar)) {
      throw new BadRequestException('Email, phone or Aadhaar, and password are required');
    }

    // Use phone if provided, otherwise fallback to Aadhaar
    const contact = phone ?? aadhaar!; // non-null because of validation

    return this.authService.register(email, contact, password);
  }

  // Login endpoint
  @Post('login')
  async login(@Body() body: LoginDto) {
    console.log('Received login body:', body);

    const { email, password } = body;

    
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.login(email, password);
  }
}
