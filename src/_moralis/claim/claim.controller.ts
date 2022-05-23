import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MoralisClaimService } from './claim.service';
import { Claim } from './entities/claim.entity';


@ApiTags('claimMoralis')
@Controller('claimMoralis')
export class MoralisClaimController {
  constructor(private readonly claimService: MoralisClaimService) {}

  @Get()
  findAll(): Promise<Claim[]> {
    return this.claimService.findAll();
  }

  @Get(':transactionHash')
  findOne(@Param('transactionHash') transactionHash: string): Promise<Claim> {
    return this.claimService.findOne(transactionHash);
  }

}
