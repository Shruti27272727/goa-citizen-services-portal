import { Controller, Post, Get, Body, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  /** APPLY FOR A SERVICE WITH DOCUMENTS **/
  @Post('apply')
  @UseInterceptors(FilesInterceptor('documents'))
  async apply(
    @Body('citizenId') citizenId: number,
    @Body('serviceId') serviceId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.appService.createWithDocument(citizenId, serviceId, files);
  }

  /** GET ALL APPLICATIONS OF A CITIZEN **/
  @Get('citizen/:id')
  async getByCitizen(@Param('id') citizenId: number) {
    return this.appService.getApplicationsByCitizen(citizenId);
  }

  /** GET FULL HISTORY OF APPLICATIONS FOR A CITIZEN **/
  @Get('history/:citizenId')
  async getHistory(@Param('citizenId') citizenId: number) {
    return this.appService.getUserHistory(citizenId);
  }

  /** GET ALL PENDING APPLICATIONS (FOR OFFICERS) **/
  @Get('pending-applications')
  async getPendingApplications() {
    return this.appService.getPendingApplications();
  }

  /** GET ALL APPLICATIONS (ADMIN) **/
  @Get('all')
  async getAllApplications() {
    return this.appService.getAllApplications();
  }

  /** GET DASHBOARD STATS AND REVENUE **/
  @Get('getDashboardStatus')
  async getDashboardStatus() {
    return this.appService.getDashboardStatus();
  }

  /** APPROVE APPLICATION **/
  @Post('approve/:applicationId/:officerId')
  async approve(
    @Param('applicationId') applicationId: number,
    @Param('officerId') officerId: number,
    @Body('remarks') remarks: string,
  ) {
    return this.appService.approveApplication(applicationId, officerId, remarks);
  }

  /** REJECT APPLICATION **/
  @Post('reject/:applicationId/:officerId')
  async reject(
    @Param('applicationId') applicationId: number,
    @Param('officerId') officerId: number,
    @Body('remarks') remarks: string,
  ) {
    return this.appService.rejectApplication(applicationId, officerId, remarks);
  }

  /** ADD OR UPDATE REMARKS WITHOUT CHANGING STATUS **/
  @Post('add-remark/:applicationId/:officerId')
  async addRemark(
    @Param('applicationId') applicationId: number,
    @Param('officerId') officerId: number,
    @Body('remark') remark: string,
  ) {
    return this.appService.addRemark(applicationId, officerId, remark);
  }
}
