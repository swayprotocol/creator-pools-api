import { Controller, Get, Param} from '@nestjs/common';
import { UnstakeService } from './unstake.service';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiTags } from '@nestjs/swagger';
import { Unstake } from './entities/unstake.entity';

@ApiTags('unstake')
@Controller('unstake')
export class UnstakeController {
  constructor(private readonly unstakeService: UnstakeService) {}

  @Get()
  findAll(): Promise<Unstake[]> {
    return this.unstakeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Unstake> {
    return this.unstakeService.findOne(id);
  }
}
