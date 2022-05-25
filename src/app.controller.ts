import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import moment from 'moment';
import { AppService } from './app.service';

@ApiTags('/')
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @ApiQuery({
    name: "fromDate",
    type: Date,
    description: "Sync database from this date til now",
    required: true
  })
  @Get('databaseSync')
  async databaseSync(@Query('fromDate') fromDate: Date) {
    return await this.appService.syncDatabse(fromDate);
  }

  @Get('/databaseSyncMinutes')
  async minutesSync(@Query('minutes') minutes: number) {
    const fromDate = moment().subtract(minutes,'minutes').toDate()
    return await this.appService.syncDatabse(fromDate);
  }

  @Get('healt')
  getHealth(): Date {
    return this.appService.getHealth();
  }
}
