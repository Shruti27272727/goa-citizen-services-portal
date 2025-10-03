import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class DatabaseSetupService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }


  async onModuleInit() {

    try {
      
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      const queryRunner = this.dataSource.createQueryRunner();


      try {

        await queryRunner.query(`
         CREATE TABLE IF NOT EXISTS departments (
           id SERIAL PRIMARY KEY,
           name TEXT[] NOT NULL
         )
       `);
        await queryRunner.query(`
CREATE TABLE IF NOT EXISTS Citizens (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  

CREATE TABLE IF NOT EXISTS Roles (
    id SERIAL PRIMARY KEY,
    citizen_id INT REFERENCES Citizens(id) ON DELETE CASCADE,
    role_name VARCHAR(50) CHECK (role_name IN ('Citizen', 'Officer', 'Admin')) NOT NULL
);


CREATE TABLE IF NOT EXISTS Aadhaar (
    id SERIAL PRIMARY KEY,
    citizen_id INT UNIQUE REFERENCES Citizens(id) ON DELETE CASCADE,
    aadhaar_number VARCHAR(12) UNIQUE NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL
);


CREATE TABLE IF NOT EXISTS Addresses (
    id SERIAL PRIMARY KEY,
    citizen_id INT REFERENCES Citizens(id) ON DELETE CASCADE,
    line1 TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS Applications (
    id SERIAL PRIMARY KEY,
    citizen_id INT REFERENCES Citizens(id) ON DELETE CASCADE,
    service_id INT NOT NULL,
    officer_id INT REFERENCES Citizens(id),
    status VARCHAR(50) CHECK (status IN ('Pending',  'Approved', 'Rejected')) DEFAULT 'Pending',
    applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_on TIMESTAMP,
    remarks VARCHAR(50)
);


CREATE TABLE IF NOT EXISTS Documents (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES Applications(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    doc_type VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS Payments (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES Applications(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Success', 'Failed')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

        await queryRunner.query(`
         CREATE TABLE IF NOT EXISTS services (
           id SERIAL PRIMARY KEY,
           department_id INTEGER NOT NULL,
           name VARCHAR(255) NOT NULL DEFAULT 'Default Service Name',
           description TEXT,
           fee DECIMAL(10,2) NOT NULL DEFAULT 0.00
         )
       `);

        const departmentCount = await queryRunner.query('SELECT COUNT(*) as count FROM departments');
        if (parseInt(departmentCount[0].count) === 0) {

          await queryRunner.query(`
           INSERT INTO departments VALUES
           (1,'Revenue') ,
           (2,'Panchayat'),
           (3,'Transport')       
         `);

        }

        const serviceCount = await queryRunner.query('SELECT COUNT(*) as count FROM services');
        if (parseInt(serviceCount[0].count) === 0) {
          console.log(' Inserting default services...');
          await queryRunner.query(`
           INSERT INTO services (department_id, name, description, fee) VALUES
           (1, 'Residence certificate', 'Apply for residence certificate', 200.00),
           (2, 'Birth Certificate', 'Apply for birth certificate', 50.00),
           (3, 'Aadhaar Card', 'Apply for aadhar card', 100.00)
           
         `);

        }

        const finalDeptCount = await queryRunner.query('SELECT COUNT(*) as count FROM departments');
        const finalServiceCount = await queryRunner.query('SELECT COUNT(*) as count FROM services');


      } finally {
        await queryRunner.release();
      }


    } catch (error) {
      console.error(' Database setup failed:', error);

    }
  }
}
