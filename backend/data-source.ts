import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { Citizen } from './backend/citizen/citizen.entity';
import { Role } from './backend/roles/roles.entity';
import { Aadhar } from './backend/aadhar/aadhar.entity';
import { Officer } from './backend/officers/officer.entity';
import { Department } from './backend/department/department.entity';
import { Service } from './backend/services/services.entity';
import { Application } from './backend/application/application.entity';
import { Document } from './backend/documents/documents.entity';
import { Payment } from './backend/payments/payments.entity';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource(
  process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        synchronize: false,
        logging: false,
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
        migrations: ['dist/migrations/*.js'],
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,
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
        migrations: ['src/migrations/*.ts'],
      }
);