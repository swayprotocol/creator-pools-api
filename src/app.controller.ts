import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @Get('/databaseSync')
  async databaseSync(@Query('fromDate') fromDate: Date) {
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
