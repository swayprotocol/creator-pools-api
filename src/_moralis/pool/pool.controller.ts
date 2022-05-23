import { Controller, Get, Param } from '@nestjs/common';
import { MoralisPoolService } from './pool.service';
import { ApiTags } from '@nestjs/swagger';
import { Pool } from './entities/pool.entity';

@ApiTags('poolMoralis')
@Controller('poolMoralis')
export class MoralisPoolController {
  constructor(private readonly poolService: MoralisPoolService) {}

  @Get()
  findAll(): Promise<Pool[]> {
    return this.poolService.findAll();
  }

  @Get(':transactionHash')
  findOne(@Param('transactionHash') transactionHash: string): Promise<Pool> {
    return this.poolService.findOne(transactionHash);
  }

}
