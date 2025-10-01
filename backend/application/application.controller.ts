import { Controller, Post, Get, Body, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post('apply')
  @UseInterceptors(FilesInterceptor('documents')) 
  async apply(
    @Body('citizenId') citizenId: number,
    @Body('serviceId') serviceId: number,
    @Body('remarks') remarks: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const parsedRemarks = remarks ? JSON.parse(remarks) : [];
    return this.appService.createWithDocument(citizenId, serviceId, parsedRemarks, files);
  }

  @Get('citizen/:id')
  async getByCitizen(@Param('id') citizenId: number) {
    return this.appService.getApplicationsByCitizen(citizenId);
  }
}
