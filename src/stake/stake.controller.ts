import { Controller, Get, Param, Query} from '@nestjs/common';
import { StakeService } from './stake.service';
import { Stake } from './entities/stake.entity';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TopStakedPools } from './dto/topStakedPools.dto';
import { ActiveStakesPool } from './entities/activeStakesPool';

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

  @Get('/totalCurrentlyStaked')
  getTotalCurrentlyStaked(): Promise<number> {
    return this.stakeService.totalCurrentlyStaked();
  }

  @Get('/totalStaked')
  getTotalStaked(): Promise<number> {
    return this.stakeService.totalStaked();
  }

  @Get('/chanelDistribution')
  getChanelDistribution() {
    return this.stakeService.chanelDistribution();
  }

  @ApiQuery({
    name: 'poolName',
    type: String,
    description: 'Pool name with its handle example: "ig-clout.art"',
    required: true
  })
  @ApiQuery({
    name: 'wallet',
    type: String,
    description: 'If you provide wallet it show only users stakes in pool',
    required: false
  })
  @Get('/activeStakesPool')
  getActiveStakesPool(@Query('poolName') poolName: string, @Query('wallet') wallet?: string): Promise<ActiveStakesPool> {
    console.log('a smo sploh kle')
    return this.stakeService.activeStakesPool(poolName, wallet);
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Stake> {
    return this.stakeService.findOne(id);
  }

  @Get('/activeStakes/:wallet')
  getActiveStakes(@Param('wallet') wallet: string): Promise<Stake[]> {
    return this.stakeService.activeStakes(wallet)
  }
}
