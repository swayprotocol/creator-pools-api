import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
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
    description: "Sync database from this date till now",
    required: true,
  })
  @Get('/databaseSync')
  async databaseSync(@Query('fromDate') fromDate: Date) {
    return await this.appService.syncDatabse(fromDate);
  }

  @ApiQuery({
    name: "minutes",
    type: Number,
    description: "Sync database from current date minus minutes till now. Default is 10, min 1, max 1680",
    required: false,
  })
  @Get('/databaseSyncMinutes')
  async minutesSync(@Query('minutes') minutes: number) {
    if (!minutes) minutes=10
    if (minutes < 1 || minutes > 1680) throw new HttpException('Parameter exceeds its limit', HttpStatus.BAD_REQUEST)
    const fromDate = moment().subtract(minutes,'minutes').toDate()
    return await this.appService.syncDatabse(fromDate);
  }

  @Get('/config')
  async getConfig(@Query('name') name: string): Promise<NodeRequire>{
    const config = await this.appService.getConfig(name)
    if (!config) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    return config
  }

  @Get('/stakingAbi')
  async getStakingAbi(@Query('name') name: string): Promise<NodeRequire>{
    const abi = await this.appService.getStakingAbi(name)
    if (!abi) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    return abi
  }

  @Get('/tokenAbi')
  async getTokenAbi(@Query('name') name: string): Promise<NodeRequire>{
    const abi = await this.appService.getTokenAbi(name)
    if (!abi) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    return abi
  }

  @Get('/healt')
  getHealth(): Date {
    return this.appService.getHealth();
  }
}
