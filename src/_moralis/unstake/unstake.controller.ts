import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MoralisUnstakeService } from './unstake.service';


@ApiTags('unstakeMoralis')
@Controller('unstakeMoralis')
export class MoralisUnstakeController {
  constructor(private readonly unstakeService: MoralisUnstakeService) {}
  
  @Get()
  findAll() {
    return this.unstakeService.findAll();
  }

  @Get(':transactionHash')
  findOne(@Param('transactionHash') transactionHash: string) {
    return this.unstakeService.findOne(transactionHash);
  }

}
