import { Controller, Get, Param} from '@nestjs/common';
import { StakeService } from './stake.service';
import { Stake } from './entities/stake.entity';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('stake')
@Controller('stake')
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}

  @Get()
  findAll(): Promise<Stake[]> {
    return this.stakeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Stake> {
    return this.stakeService.findOne(id);
  }

}
