import { Controller, Post, Get, Body, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) { }


  @Post('apply')
  @UseInterceptors(FilesInterceptor('documents'))
  async apply(
    @Body('citizenId') citizenId: number,
    @Body('serviceId') serviceId: number,
    @Body('remarks') remarks: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {

    console.log('checkservice', serviceId);
    console.log('citizenidcheck', citizenId);
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
  async getPendingApplication() {
    return this.appService.getPendingApplications();

  }

   @Get('all')
  async getAllApplications() {
    return this.appService.getAllApplications();

  }

  @Get('status')
  async getStatus(){
    return this.appService.getStatus();
  }

 
@Get('dashboard')
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





}
