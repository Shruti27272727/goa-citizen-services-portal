import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  
  @Post('apply')
  @UseInterceptors(FilesInterceptor('documents')) 
  async apply(
    @Body('citizenId') citizenId: number,
    @Body('serviceId') serviceId: number,
    @Body('remarks') remarks: string = '[]',
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (!citizenId) throw new BadRequestException('Citizen ID is required');
    if (!serviceId) throw new BadRequestException('Service ID is required');

    
    let parsedRemarks: string[];
    try {
      parsedRemarks = JSON.parse(remarks);
      if (!Array.isArray(parsedRemarks)) parsedRemarks = [];
    } catch {
      parsedRemarks = [];
    }

    try {
      const application = await this.applicationService.createWithDocument(
        citizenId,
        serviceId,
        parsedRemarks,
        files,
      );

      return {
        status: 'success',
        message: 'Application submitted successfully',
        application,
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to submit application',
      };
    }
  }

 
  @Get('history')
  async getHistory(@Query('citizenId') citizenId: number) {
    if (!citizenId) throw new BadRequestException('Citizen ID is required');

    try {
      const applications = await this.applicationService.getApplicationsByCitizen(citizenId);

      
      const transformedApplications = applications.map((app) => ({
        id: app.id,
        service: app.service?.name || 'N/A',
        status: app.status,
        remarks: Array.isArray(app.remarks) ? app.remarks : [],
        documents: app.documents?.map((doc) => ({
          id: doc.id,
          fileName: doc.fileName,
          filePath: doc.filePath,
        })) || [],
        applied_on: app.applied_on,
        completed_on: app.completed_on,
      }));

      return {
        status: 'success',
        message: 'Application history fetched successfully',
        applications: transformedApplications,
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to fetch application history',
      };
    }
  }
}
