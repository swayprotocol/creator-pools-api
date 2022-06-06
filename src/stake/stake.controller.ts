import { Controller, Get, HttpException, HttpStatus, Param, Query} from '@nestjs/common';
import { StakeService } from './stake.service';
import { Stake } from './entities/stake.entity';
import { ValidateMongoId } from '../validators/MongoId';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TopStakedPools } from './dto/topStakedPools.dto';
import { ActiveStakesPool } from './entities/helper.interfaces';

@ApiTags('stake')
@Controller('stake')
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}

  @Get()
  findAll(): Promise<Stake[]> {
    return this.stakeService.findAll();
  }

  @ApiOperation({ summary: 'Pools ordered by most tokens staked'})
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
  @ApiOperation({ summary: 'Stakes ordered by date'})
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
  @ApiOperation({ summary: 'Stakes ordered by tokens staked'})
  @Get('/highestPositions')
  highestPositions(@Query('limit') limit?: number): Promise<Stake[]> {
    return this.stakeService.highestPositions(limit ? limit : 10);
  }

  @ApiOperation({ summary: 'Total tokens currently staked on this smartcontract'})
  @Get('/totalCurrentlyStaked')
  getTotalCurrentlyStaked(): Promise<{token:string, totalStaked:number}[] | []> {
    return this.stakeService.totalCurrentlyStaked();
  }

  @ApiOperation({ summary: 'Total tokens staked on this smartcontract'})
  @Get('/totalStaked')
  getTotalStaked(): Promise<{token:string, totalAmount:number, totalUsd:number}[] | []> {
    return this.stakeService.totalStaked();
  }

  @ApiQuery({
    name: 'poolName',
    type: String,
    description: 'Pool name with its handle example: "0xasd2asad2asd2...."',
    required: true
  })
  @ApiQuery({
    name: 'wallet',
    type: String,
    description: 'If you provide wallet it show only users stakes in pool',
    required: false
  })
  @ApiOperation({ summary: 'All active stakes in pool, if wallet provided filter by wallet'})
  @Get('/activeStakesPool')
  async getActiveStakesPool(@Query('poolName') poolName: string, @Query('wallet') wallet?: string): Promise<ActiveStakesPool> {
    if (wallet) wallet = wallet.toLowerCase()
    const activeStakes = await this.stakeService.activeStakesPool(poolName, wallet);
    if (!activeStakes.poolHandle) throw new HttpException('Pool not found', HttpStatus.NOT_FOUND)
    return activeStakes
  }

  @ApiQuery({
    name: 'wallet',
    type: String,
    required: true
  })
  @ApiOperation({ summary: 'All active stakes by wallet grouped by pools'})
  @Get('/activeStakesWallet')
  async getActiveStakesWallet(@Query('wallet') wallet: string): Promise<ActiveStakesPool[]> {
    if (!wallet) throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND)
    return this.stakeService.activeStakesPools(wallet.toLowerCase())
  }

  @ApiOperation({ summary: 'Get overview of both tokens'})
  @Get('/overview')
  async getOverview() {
    return this.stakeService.overview()
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Stake> {
    return this.stakeService.findOne(id);
  }

  @ApiOperation({ summary: 'All active stakes in all pools by wallet'})
  @Get('/allActiveStakes/:wallet')
  getActiveStakes(@Param('wallet') wallet: string): Promise<Stake[]> {
    return this.stakeService.activeStakes(wallet.toLowerCase())
  }
}
