import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoolService } from './pool.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { Pool } from './entities/pool.entity';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pool')
@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Post()
  create(@Body() createPoolDto: CreatePoolDto): Promise<Pool> {
    return this.poolService.create(createPoolDto);
  }

  @Get()
  findAll(): Promise<Pool[]> {
    return this.poolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Pool> {
    return this.poolService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ValidateMongoId) id: string, @Body() updatePoolDto: CreatePoolDto): Promise<Pool> {
    return this.poolService.update(id, updatePoolDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoId) id: string): Promise<Pool> {
    return this.poolService.remove(id);
  }
}
