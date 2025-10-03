import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseSetupService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      const queryRunner = this.dataSource.createQueryRunner();

      try {
        // --- Departments ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS departments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
          )
        `);

        // --- Citizens ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS citizens (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // --- Roles ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS roles (
            id SERIAL PRIMARY KEY,
            citizen_id INT REFERENCES citizens(id) ON DELETE CASCADE,
            role_name VARCHAR(50) CHECK (role_name IN ('Citizen', 'Officer', 'Admin')) NOT NULL
          )
        `);

        // --- Aadhaar ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS aadhaar (
            id SERIAL PRIMARY KEY,
            citizen_id INT UNIQUE REFERENCES citizens(id) ON DELETE CASCADE,
            aadhaar_number VARCHAR(12) UNIQUE NOT NULL,
            dob DATE NOT NULL,
            gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL
          )
        `);

        // --- Addresses ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS addresses (
            id SERIAL PRIMARY KEY,
            citizen_id INT REFERENCES citizens(id) ON DELETE CASCADE,
            line1 TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            pincode VARCHAR(10) NOT NULL,
            is_primary BOOLEAN DEFAULT FALSE
          )
        `);

        // --- Services ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS services (
            id SERIAL PRIMARY KEY,
            department_id INT NOT NULL REFERENCES departments(id),
            name VARCHAR(255) NOT NULL DEFAULT 'Default Service Name',
            description TEXT,
            fee DECIMAL(10,2) NOT NULL DEFAULT 0.00
          )
        `);

        // --- Applications ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            citizen_id INT REFERENCES citizens(id) ON DELETE CASCADE,
            service_id INT NOT NULL REFERENCES services(id),
            officer_id INT REFERENCES citizens(id),
            status VARCHAR(50) CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
            applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_on TIMESTAMP,
            remarks VARCHAR(255)
          )
        `);

        // --- Documents ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS documents (
            id SERIAL PRIMARY KEY,
            application_id INT REFERENCES applications(id) ON DELETE CASCADE,
            file_url TEXT NOT NULL,
            doc_type VARCHAR(100) NOT NULL
          )
        `);

        // --- Payments ---
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY,
            application_id INT REFERENCES applications(id) ON DELETE CASCADE,
            razorpay_order_id VARCHAR(100) UNIQUE NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(50) CHECK (status IN ('Pending', 'Success', 'Failed')) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // --- Insert default Departments ---
        const departmentCount = await queryRunner.query('SELECT COUNT(*) as count FROM departments');
        if (parseInt(departmentCount[0].count) === 0) {
          await queryRunner.query(`
            INSERT INTO departments (id, name) VALUES
              (1, 'Revenue'),
              (2, 'Panchayat'),
              (3, 'Transport')
          `);
        }

        // --- Insert default Services ---
        const serviceCount = await queryRunner.query('SELECT COUNT(*) as count FROM services');
        if (parseInt(serviceCount[0].count) === 0) {
          await queryRunner.query(`
            INSERT INTO services (department_id, name, description, fee) VALUES
              (1, 'Residence Certificate', 'Apply for residence certificate', 200.00),
              (2, 'Birth Certificate', 'Apply for birth certificate', 50.00),
              (2, 'Aadhaar Card', 'Apply for Aadhaar card', 100.00),
              (3, 'Driving License', 'Apply for driving license', 300.00)
          `);
        }

        // --- Optional: Log about Roles ---
        const roleCount = await queryRunner.query('SELECT COUNT(*) as count FROM roles');
        if (parseInt(roleCount[0].count) === 0) {
          console.log('Roles table is empty. Roles can be assigned to citizens/officers/admins manually.');
        }

      } finally {
        await queryRunner.release();
      }

    } catch (error) {
      console.error('Database setup failed:', error);
    }
  }
}
