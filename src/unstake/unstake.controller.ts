import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnstakeService } from './unstake.service';
import { CreateUnstakeDto } from './dto/create-unstake.dto';
import { UpdateUnstakeDto } from './dto/update-unstake.dto';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiTags } from '@nestjs/swagger';
import { Unstake } from './entities/unstake.entity';

@ApiTags('unstake')
@Controller('unstake')
export class UnstakeController {
  constructor(private readonly unstakeService: UnstakeService) {}

  @Post()
  create(@Body() createUnstakeDto: CreateUnstakeDto): Promise<Unstake> {
    return this.unstakeService.create(createUnstakeDto);
  }

  @Get()
  findAll(): Promise<Unstake[]> {
    return this.unstakeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Unstake> {
    return this.unstakeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ValidateMongoId) id: string, @Body() updateUnstakeDto: UpdateUnstakeDto): Promise<Unstake> {
    return this.unstakeService.update(id, updateUnstakeDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoId) id: string): Promise<Unstake> {
    return this.unstakeService.remove(id);
  }
}
