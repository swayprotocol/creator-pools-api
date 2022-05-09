import { Controller, Get, Param, Post} from '@nestjs/common';
import { StakeService } from './stake.service';
import { Stake } from './entities/stake.entity';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiTags } from '@nestjs/swagger';
import { TopStakedPools } from './dto/topStakedPools.dto';

@ApiTags('stake')
@Controller('stake')
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}

  @Get()
  findAll(): Promise<Stake[]> {
    return this.stakeService.findAll();
  }

  @Get('/topStakedPools')
  topStakedPools(): Promise<TopStakedPools[]> {
    return this.stakeService.topCreatorPools();  
  }

  @Post('/latestStakes')
  latestStakes(@Param('maxNumber') maxNumber: number): Promise<Stake[]> {
    return this.stakeService.latestStakes(maxNumber);
  }

  @Post('/highestPositions')
  highestPositions(@Param('maxNumber') maxNumber: number): Promise<Stake[]> {
    return this.stakeService.highestPositions(maxNumber);
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Stake> {
    return this.stakeService.findOne(id);
  }
}
