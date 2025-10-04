import { AppDataSource } from '../typeorm.config';
import { Department } from './department/department.entity';
import { Service } from './services/services.entity';
import { Officer } from './officers/officer.entity';
import { Any } from 'typeorm';

async function seed() {
  await AppDataSource.initialize();

  const departmentRepo = AppDataSource.getRepository(Department);
  const serviceRepo = AppDataSource.getRepository(Service);
  const officerRepo = AppDataSource.getRepository(Officer);

  // --- Departments ---
  if ((await departmentRepo.count()) === 0) {
    const departments = [
      { name: "Revenue" },
      { name: "Panchayat" },
      { name: "Transport" },
    ].map(d => departmentRepo.create(d));

    await departmentRepo.save(departments);
    console.log('✅ Departments seeded');
  }

  const revenue = await departmentRepo.findOne({ where: { name: "Revenue" } });
  const panchayat = await departmentRepo.findOne({ where: { name: "Panchayat" } });
  const transport = await departmentRepo.findOne({ where: { name: "Transport" } });


  if (!revenue || !panchayat || !transport) throw new Error('Departments not found');

  // --- Services ---
  if ((await serviceRepo.count()) === 0) {
    const services = [
      { department: revenue, name: 'Residence Certificate', description: 'Apply for residence certificate', fee: 200 },
      { department: panchayat, name: 'Birth Certificate', description: 'Apply for birth certificate', fee: 50 },
      { department: panchayat, name: 'Aadhaar Card', description: 'Apply for Aadhaar card', fee: 100 },
      { department: transport, name: 'Driving License', description: 'Apply for driving license', fee: 300 },
    ].map(s => serviceRepo.create(s));

    await serviceRepo.save(services);
    console.log('✅ Services seeded');
  }

  // --- Officers ---
  if ((await officerRepo.count()) === 0) {
    const officers = [
      { name: 'John Officer', email: 'officer1@goa.gov.in', password: '$2b$10$GheT4LjzP4xDmUX6v8stU.pQf5rFzoa09DQugy5m2U1WAkavdT32G' },
      { name: 'Johnny Officer', email: 'officer2@goa.gov.in', password: '$2b$10$GheT4LjzP4xDmUX6v8stU.pQf5rFzoa09DQugy5m2U1WAkavdT32G' },
    ].map(o => officerRepo.create(o));

    await officerRepo.save(officers);
    console.log('✅ Officers seeded');
  }

  await AppDataSource.destroy();
  console.log('🌱 Database seeding complete');
}

seed().catch(err => console.error('❌ Seeding error:', err));
