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


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // your postgres username
  password: 'yourpassword', // your postgres password
  database: 'goa_portal', // your database name
  synchronize: false, // always false in production; use migrations
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
  migrations: ['migrations/*.ts'],
  subscribers: [],
});


