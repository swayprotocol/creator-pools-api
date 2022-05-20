import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoralisPoolService } from './pool.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pool } from './entities/pool.entity';

@ApiTags('poolMoralis')
@Controller('poolMoralis')
export class MoralisPoolController {
  constructor(private readonly poolService: MoralisPoolService) {}

  @Post()
  create(@Body() createPoolDto: CreatePoolDto) {
    return this.poolService.create(createPoolDto);
  }

  @Get()
  findAll(): Promise<Pool[]> {
    return this.poolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoolDto: UpdatePoolDto) {
    return this.poolService.update(+id, updatePoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolService.remove(+id);
  }
}
