import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Status } from './application.entity';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  
  @Post()
  async create(@Body() body: { citizenId: number; serviceId: number; remarks: string[] }) {
    return this.appService.create(body);
  }

  
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: Status; officerId: number },
  ) {
    return this.appService.updateStatus(+id, body.officerId, body.status);
  }

  
  @Get('citizen/:citizenId')
  async getByCitizen(@Param('citizenId') citizenId: string) {
    return this.appService.getApplicationsByCitizen(+citizenId);
  }

 
  @Get('pending')
  async getPending() {
    return this.appService.getPendingApplications();
  }
}
