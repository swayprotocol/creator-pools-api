import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
@ApiTags('/')
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('databaseSync')
  async databaseSync() {
    return await this.appService.syncDatabse();
  }

  @Get('healt')
  getHealth(): Date {
    return this.appService.getHealth();
  }
}
