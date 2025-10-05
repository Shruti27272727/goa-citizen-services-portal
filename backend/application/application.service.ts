import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity';
import { Citizen } from '../citizen/citizen.entity';
import { Service } from '../services/services.entity';
import { Document } from '../documents/documents.entity';
import { PaymentsService } from '../payments/payments.service';
import { Officer } from '../officers/officer.entity';
import { Role } from '../roles/roles.entity';
import { Department } from '../department/department.entity';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,

    @InjectRepository(Citizen)
    private readonly citizenRepo: Repository<Citizen>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,

    @InjectRepository(Officer)
    private readonly officerRepo: Repository<Officer>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,

    private readonly paymentsService: PaymentsService,
  ) {}

  /** ------------------- APPLICATION METHODS ------------------- **/

  async createWithDocument(
    citizenId: number,
    serviceId: number | string,
    files: Express.Multer.File[] = [],
  ) {
    const citizen = await this.citizenRepo.findOne({ where: { id: citizenId } });
    if (!citizen) throw new NotFoundException('Citizen not found');

    const serviceNum = Number(serviceId);
    if (isNaN(serviceNum) || serviceNum <= 0)
      throw new BadRequestException('Invalid serviceId');

    const service = await this.serviceRepo.findOne({
      where: { id: serviceNum },
      relations: ['department'],
    });
    if (!service) throw new NotFoundException('Service not found');

    const application = this.applicationRepo.create({
      status: ApplicationStatus.PENDING,
      citizen,
      service,
    });
    const savedApp = await this.applicationRepo.save(application);

    // Upload documents
    const uploadDir = join(__dirname, '../../uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    for (const file of files) {
      const filePath = join(uploadDir, file.originalname);
      writeFileSync(filePath, file.buffer);

      const doc = this.documentRepo.create({
        fileName: file.originalname,
        filePath,
        application: savedApp,
      });
      await this.documentRepo.save(doc);
    }

    // Payment
    const amount = Number(service.fee) || 100;
    const payment = await this.paymentsService.createPayment(savedApp.id, amount);

    const appWithRelations = await this.applicationRepo.findOne({
      where: { id: savedApp.id },
      relations: ['service', 'service.department', 'documents', 'officer', 'citizen'],
    });

    return {
      application: appWithRelations,
      payment: {
        id: payment.id,
        order: {
          id: payment.razorpayOrderId,
          amount: payment.amount,
          currency: 'INR',
        },
      },
    };
  }

  async getApplicationsByCitizen(citizenId: number) {
    return this.applicationRepo.find({
      where: { citizen: { id: citizenId } },
      relations: ['service', 'service.department', 'documents', 'officer'],
      order: { appliedOn: 'DESC' },
    });
  }

  async getUserHistory(citizenId: number) {
    return this.getApplicationsByCitizen(citizenId);
  }

  async getPendingApplications() {
    return this.applicationRepo.find({
      where: { status: ApplicationStatus.PENDING },
      relations: ['service', 'service.department', 'documents', 'officer', 'citizen'],
      order: { appliedOn: 'DESC' },
    });
  }

  async getAllApplications() {
    return this.applicationRepo.find({
      relations: ['service', 'service.department', 'documents', 'officer', 'citizen'],
      order: { appliedOn: 'DESC' },
    });
  }

  async getDashboardStatus() {
    const rawStatus = await this.applicationRepo.query(`
      SELECT status, COUNT(*) AS total
      FROM applications
      GROUP BY status
    `);

    const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
    rawStatus.forEach((row: any) => {
      const key = row.status.toLowerCase();
      const count = parseInt(row.total, 10);
      stats.total += count;
      if (key === 'pending') stats.pending = count;
      if (key === 'approved') stats.approved = count;
      if (key === 'rejected') stats.rejected = count;
    });

    const rawRevenue = await this.applicationRepo.query(`
      SELECT d.name AS department, COALESCE(SUM(p.amount), 0) AS revenue
      FROM departments d
      LEFT JOIN services s ON s.department_id = d.id
      LEFT JOIN applications a ON a.service_id = s.id
      LEFT JOIN payments p ON p.application_id = a.id
      WHERE d.name IN ('Revenue', 'Panchayat', 'Transport')
      GROUP BY d.name
    `);

    const revenueData: Record<string, number> = { Revenue: 0, Panchayat: 0, Transport: 0 };
    rawRevenue.forEach((row: any) => {
      revenueData[row.department] = parseInt(row.revenue, 10);
    });

    return { stats, revenueData };
  }

  async addRemark(applicationId: number, officerId: number, remark: string) {
    if (!remark || remark.trim() === '') {
      throw new BadRequestException('Remark cannot be empty');
    }

    const app = await this.applicationRepo.findOne({
      where: { id: applicationId },
      relations: ['officer', 'service', 'service.department', 'documents', 'citizen'],
    });
    if (!app) throw new NotFoundException('Application not found');

    const officer = await this.officerRepo.findOne({ where: { id: officerId } });
    if (!officer) throw new NotFoundException('Officer not found');

    app.remarks = remark;
    app.officer = officer;

    return this.applicationRepo.save(app);
  }

  async approveApplication(appId: number, officerId: number, remarks: string) {
    return this.changeApplicationStatus(appId, officerId, ApplicationStatus.APPROVED, remarks);
  }

  async rejectApplication(appId: number, officerId: number, remarks: string) {
    return this.changeApplicationStatus(appId, officerId, ApplicationStatus.REJECTED, remarks);
  }

  private async changeApplicationStatus(
    appId: number,
    officerId: number,
    status: ApplicationStatus,
    remarks: string,
  ) {
    const app = await this.applicationRepo.findOne({
      where: { id: appId },
      relations: ['officer', 'service', 'service.department', 'documents', 'citizen'],
    });
    if (!app) throw new NotFoundException('Application not found');

    const officer = await this.officerRepo.findOne({ where: { id: officerId } });
    if (!officer) throw new NotFoundException('Officer not found');

    app.status = status;
    app.completedOn = new Date();
    app.officer = officer;
    app.remarks = remarks;

    return this.applicationRepo.save(app);
  }

  /** ------------------- SERVICE MANAGEMENT ------------------- **/
  async createService(name: string, fee: number, departmentId: number) {
    const department = await this.departmentRepo.findOne({ where: { id: departmentId } });
    if (!department) throw new NotFoundException('Department not found');

    const service = this.serviceRepo.create({ name, fee, department });
    return this.serviceRepo.save(service);
  }

  async updateService(serviceId: number, data: Partial<Service>) {
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    Object.assign(service, data);
    return this.serviceRepo.save(service);
  }

  async deleteService(serviceId: number) {
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    return this.serviceRepo.remove(service);
  }

  async listServices() {
    return this.serviceRepo.find({ relations: ['department'] });
  }

  /** ------------------- DEPARTMENT MANAGEMENT ------------------- **/
  async createDepartment(name: string) {
    const dept = this.departmentRepo.create({ name });
    return this.departmentRepo.save(dept);
  }

  async updateDepartment(departmentId: number, name: string) {
    const dept = await this.departmentRepo.findOne({ where: { id: departmentId } });
    if (!dept) throw new NotFoundException('Department not found');

    dept.name = name;
    return this.departmentRepo.save(dept);
  }

  async deleteDepartment(departmentId: number) {
    const dept = await this.departmentRepo.findOne({ where: { id: departmentId } });
    if (!dept) throw new NotFoundException('Department not found');

    return this.departmentRepo.remove(dept);
  }

  async listDepartments() {
    return this.departmentRepo.find();
  }

  /** ------------------- OFFICER ASSIGNMENT ------------------- **/
  async assignOfficer(officerId: number, departmentId: number) {
    const officer = await this.officerRepo.findOne({ where: { id: officerId } });
    if (!officer) throw new NotFoundException('Officer not found');

    const department = await this.departmentRepo.findOne({ where: { id: departmentId } });
    if (!department) throw new NotFoundException('Department not found');

    officer.department_id = department.id;
    return this.officerRepo.save(officer);
  }

  /** ------------------- ROLE MANAGEMENT ------------------- **/
  async createRole(roleType: string) {
    const role = this.roleRepo.create({ role_type: roleType });
    return this.roleRepo.save(role);
  }

async assignRole(userId: number, roleId: number, userType: 'Citizen' | 'Officer') {
  const role = await this.roleRepo.findOne({ where: { id: roleId } });
  if (!role) throw new NotFoundException('Role not found');

  if (userType === 'Citizen') {
    const citizen = await this.citizenRepo.findOne({ where: { id: userId } });
    if (!citizen) throw new NotFoundException('Citizen not found');

    if (role.role_type !== "citizen" && role.role_type !== "admin") {
      throw new BadRequestException("Invalid role type");
    }

    citizen.role = role.role_type; // now type-safe
    return this.citizenRepo.save(citizen);

  } else {
    const officer = await this.officerRepo.findOne({ where: { id: userId } });
    if (!officer) throw new NotFoundException('Officer not found');

    // assign department_id (use proper mapping)
    officer.department_id = role.id; 
    return this.officerRepo.save(officer);
  }
}

}
