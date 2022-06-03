import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClaimService } from './claim.service';
import { ValidateMongoId } from './../validators/MongoId';

@ApiTags('claim')
@Controller('claim')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Get()
  findAll() {
    return this.claimService.findAll();
  }

  @ApiOperation({ summary: 'Rewards are always collected in SWAY token'})
  @Get('totalRewards')
  getTotalRewards(): Promise<number> {
    return this.claimService.totalClaimed();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string) {
    return this.claimService.findOne(id);
  }

}
