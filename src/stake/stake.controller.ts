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
    name: "maxNumber",
    type: String,
    description: "Optional parameter, default is 10",
    required: false
  })
  @Get('/latestStakes/:maxNumber')
  latestStakes(@Query('maxNumber') maxNumber?: number): Promise<Stake[]> {
    return this.stakeService.latestStakes(maxNumber ? maxNumber : 10);
  }

  @ApiQuery({
    name: "maxNumber",
    type: String,
    description: "Optional parameter, default is 10",
    required: false
  })
  @Get('/highestPositions/:maxNumber')
  highestPositions(@Query('maxNumber') maxNumber?: number): Promise<Stake[]> {
    return this.stakeService.highestPositions(maxNumber ? maxNumber : 10);
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string): Promise<Stake> {
    return this.stakeService.findOne(id);
  }
}
