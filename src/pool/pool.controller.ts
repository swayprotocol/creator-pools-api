import { Controller, Get, Param} from '@nestjs/common';
import { PoolService } from './pool.service';
import { Pool } from './entities/pool.entity';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pool')
@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Get()
  findAll(): Promise<Pool[]> {
    return this.poolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Pool> {
    return this.poolService.findOne(id);
  }
}
