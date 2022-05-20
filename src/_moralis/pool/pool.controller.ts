import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoralisPoolService } from './pool.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pool } from './entities/pool.entity';
import { query } from 'express';

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
