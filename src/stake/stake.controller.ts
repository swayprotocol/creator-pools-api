import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StakeService } from './stake.service';
import { CreateStakeDto } from './dto/create-stake.dto';
import { Stake } from './entities/stake.entity';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('stake')
@Controller('stake')
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}

  @Post()
  create(@Body() createStakeDto: CreateStakeDto): Promise<Stake> {
    return this.stakeService.create(createStakeDto);
  }

  @Get()
  findAll(): Promise<Stake[]> {
    return this.stakeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Stake> {
    return this.stakeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ValidateMongoId) id: string, @Body() updateStakeDto: CreateStakeDto): Promise<Stake> {
    return this.stakeService.update(id, updateStakeDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoId) id: string): Promise<Stake> {
    return this.stakeService.remove(id);
  }
}
