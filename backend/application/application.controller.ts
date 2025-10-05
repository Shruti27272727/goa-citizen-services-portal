import { Controller, Post, Get, Body, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  /** ------------------- APPLICATION ENDPOINTS ------------------- **/

  @Post('apply')
  @UseInterceptors(FilesInterceptor('documents'))
  async apply(
    @Body('citizenId') citizenId: number,
    @Body('serviceId') serviceId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.appService.createWithDocument(citizenId, serviceId, files);
  }

  @Get('citizen/:id')
  async getByCitizen(@Param('id') citizenId: number) {
    return this.appService.getApplicationsByCitizen(citizenId);
  }

  @Get('history/:citizenId')
  async getHistory(@Param('citizenId') citizenId: number) {
    return this.appService.getUserHistory(citizenId);
  }

  @Get('pending-applications')
  async getPendingApplications() {
    return this.appService.getPendingApplications();
  }

  @Get('all')
  async getAllApplications() {
    return this.appService.getAllApplications();
  }

  @Get('getDashboardStatus')
  async getDashboardStatus() {
    return this.appService.getDashboardStatus();
  }

  @Post('approve/:applicationId/:officerId')
  async approve(
    @Param('applicationId') applicationId: number,
    @Param('officerId') officerId: number,
    @Body('remarks') remarks: string,
  ) {
    return this.appService.approveApplication(applicationId, officerId, remarks);
  }

  @Post('reject/:applicationId/:officerId')
  async reject(
    @Param('applicationId') applicationId: number,
    @Param('officerId') officerId: number,
    @Body('remarks') remarks: string,
  ) {
    return this.appService.rejectApplication(applicationId, officerId, remarks);
  }

  @Post('add-remark/:applicationId/:officerId')
  async addRemark(
    @Param('applicationId') applicationId: number,
    @Param('officerId') officerId: number,
    @Body('remark') remark: string,
  ) {
    return this.appService.addRemark(applicationId, officerId, remark);
  }

  /** ------------------- SERVICE ENDPOINTS ------------------- **/

  @Post('service/create')
  async createService(
    @Body('name') name: string,
    @Body('fee') fee: number,
    @Body('departmentId') departmentId: number,
  ) {
    return this.appService.createService(name, fee, departmentId);
  }

  @Post('service/update/:serviceId')
  async updateService(
    @Param('serviceId') serviceId: number,
    @Body() data: { name?: string; fee?: number; departmentId?: number },
  ) {
    return this.appService.updateService(serviceId, data);
  }

  @Post('service/delete/:serviceId')
  async deleteService(@Param('serviceId') serviceId: number) {
    return this.appService.deleteService(serviceId);
  }

  @Get('services')
  async listServices() {
    return this.appService.listServices();
  }

  /** ------------------- DEPARTMENT ENDPOINTS ------------------- **/

  @Post('department/create')
  async createDepartment(@Body('name') name: string) {
    return this.appService.createDepartment(name);
  }

  @Post('department/update/:departmentId')
  async updateDepartment(
    @Param('departmentId') departmentId: number,
    @Body('name') name: string,
  ) {
    return this.appService.updateDepartment(departmentId, name);
  }

  @Post('department/delete/:departmentId')
  async deleteDepartment(@Param('departmentId') departmentId: number) {
    return this.appService.deleteDepartment(departmentId);
  }

  @Get('departments')
  async listDepartments() {
    return this.appService.listDepartments();
  }

  /** ------------------- OFFICER ASSIGNMENT ------------------- **/

  @Post('officer/assign/:officerId/:departmentId')
  async assignOfficer(
    @Param('officerId') officerId: number,
    @Param('departmentId') departmentId: number,
  ) {
    return this.appService.assignOfficer(officerId, departmentId);
  }

  /** ------------------- ROLE MANAGEMENT ------------------- **/

  @Post('role/create')
  async createRole(@Body('roleType') roleType: string) {
    return this.appService.createRole(roleType);
  }

  @Post('role/assign')
  async assignRole(
    @Body('userId') userId: number,
    @Body('roleId') roleId: number,
    @Body('userType') userType: 'Citizen' | 'Officer',
  ) {
    return this.appService.assignRole(userId, roleId, userType);
  }
}
