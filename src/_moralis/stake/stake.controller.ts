import { Controller, Get, Param, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MoralisStakeService } from './stake.service';

@ApiTags('stakeMoralis')
@Controller('stkaeMoralis')
export class MoralisStakeController {
  constructor(private readonly stakeService: MoralisStakeService) {}

  @Get()
  findAll() {
    return this.stakeService.findAll();
  }

  @Get(':transactionHash')
  findOne(@Param('transactionHash') transactionHash: string) {
    return this.stakeService.findOne(transactionHash);
  }
}
