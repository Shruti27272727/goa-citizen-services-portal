import { Controller, Post, Get, Body, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  // ✅ Apply for a service with documents
  @Post('apply')
  @UseInterceptors(FilesInterceptor('documents'))
  async apply(
    @Body('citizenId') citizenId: number,
    @Body('serviceId') serviceId: number,
    @Body('remarks') remarks: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.appService.createWithDocument(citizenId, serviceId, files);
  }

  // ✅ Get all applications of a citizen
  @Get('citizen/:id')
  async getByCitizen(@Param('id') citizenId: number) {
    return this.appService.getApplicationsByCitizen(citizenId);
  }

  // ✅ Get full history of applications for a citizen
  @Get('history/:citizenId')
  async getHistory(@Param('citizenId') citizenId: number) {
    return this.appService.getUserHistory(citizenId);
  }

  // ✅ Get all pending applications for officers
  @Get('pending-applications')
  async getPendingApplications() {
    return this.appService.getPendingApplications();
  }

  // ✅ Get all applications (admin)
  @Get('all')
  async getAllApplications() {
    return this.appService.getAllApplications();
  }

  // ✅ Get dashboard stats and revenue
  @Get('getDashboardStatus')
  async getDashboardStatus() {
    return this.appService.getDashboardStatus();
  }

  // ✅ Approve application
  @Post('approve/:applicationId/:officerId')
  async approve(
    @Param('applicationId') applicationId: number,
    @Param('officerId') officerId: number,
    @Body('remarks') remarks: string,
  ) {
    return this.appService.approveApplication(applicationId, officerId, remarks);
  }

  // ✅ Reject application
  @Post('reject/:applicationId/:officerId')
  async reject(
    @Param('applicationId') applicationId: number,
    @Param('officerId') officerId: number,
    @Body('remarks') remarks: string,
  ) {
    return this.appService.rejectApplication(applicationId, officerId, remarks);
  }
}
