import { Controller, Get, Param, Query} from '@nestjs/common';
import { StakeService } from './stake.service';
import { Stake } from './entities/stake.entity';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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

  @ApiQuery({
    name: "limit",
    type: String,
    description: "Optional parameter, default is 10",
    required: false
  })
  @Get('/latestStakes')
  latestStakes(@Query('limit') limit?: number): Promise<Stake[]> {
    return this.stakeService.latestStakes(limit ? limit : 10);
  }

  @ApiQuery({
    name: "limit",
    type: String,
    description: "Optional parameter, default is 10",
    required: false
  })
  @Get('/highestPositions')
  highestPositions(@Query('limit') limit?: number): Promise<Stake[]> {
    return this.stakeService.highestPositions(limit ? limit : 10);
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Stake> {
    return this.stakeService.findOne(id);
  }
}
