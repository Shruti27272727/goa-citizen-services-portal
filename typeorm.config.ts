import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Citizen } from './backend/citizen/citizen.entity';
import { Role } from './backend/roles/roles.entity';
import { Aadhar } from './backend/aadhar/aadhar.entity';
import { Officer } from './backend/officers/officer.entity';
import { Department } from './backend/department/department.entity';
import { Service } from './backend/services/services.entity';
import { Application } from './backend/application/application.entity';
import { Document } from './backend/documents/documents.entity';
import { Payment } from './backend/payments/payments.entity';

// Load env variables
const isProduction = !!process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
  isProduction
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL, // Railway injects this automatically
        synchronize: false, // keep false for production
        logging: false,
        ssl: { rejectUnauthorized: false }, // Required for Railway SSL
        entities: [
          Citizen,
          Role,
          Aadhar,
          Officer,
          Department,
          Service,
          Application,
          Document,
          Payment,
        ],
        migrations: ['migrations/*.ts'],
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'yourpassword',
        database: process.env.DB_DATABASE || 'goa_portal',
        synchronize: true, // ok for local dev
        logging: true,
        entities: [
          Citizen,
          Role,
          Aadhar,
          Officer,
          Department,
          Service,
          Application,
          Document,
          Payment,
        ],
        migrations: ['migrations/*.ts'],
      }
);
