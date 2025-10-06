import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Citizen } from './citizen/citizen.entity';
import { Aadhar } from './aadhar/aadhar.entity';
import { Address } from './addresses/addresses.entity';
import { Role } from './roles/roles.entity';
import { Department } from './department/department.entity';
import { Service } from './services/services.entity';
import { Application } from './application/application.entity';
import { Document } from './documents/documents.entity';
import { Payment } from './payments/payments.entity';
import { Officer } from './officers/officer.entity';

import { CitizenModule } from './citizen/citizen.module';
import { AadharModule } from './aadhar/aadhar.module';
import { AddressesModule } from './addresses/addresses.module';
import { RolesModule } from './roles/roles.module';
import { DepartmentModule } from './department/department.module';
import { ServicesModule } from './services/services.module';
import { ApplicationModule } from './application/application.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentsModule } from './payments/payments.module';
import { OfficerModule } from './officers/officer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
       
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_URL'),
          port: Number(configService.get('DB_PORT') ?? 5432),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [
            Citizen,
            Aadhar,
            Address,
            Role,
            Department,
            Service,
            Application,
            Document,
            Payment,
            Officer,
          ],
          logging: ['error', 'warn', 'query'],
          synchronize: true, // only for development, disable in production
        };
      },
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),

    CitizenModule,
    AadharModule,
    AddressesModule,
    RolesModule,
    DepartmentModule,
    ServicesModule,
    ApplicationModule,
    DocumentsModule,
    PaymentsModule,
    OfficerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
