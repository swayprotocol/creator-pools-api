import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { claimSchema } from './entities/claim.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StakingContract } from '../shared/StakingContract';
import { PoolModule } from 'src/pool/pool.module';
import { UnstakeModule } from 'src/unstake/unstake.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Claim', schema: claimSchema}], 'ourDb'),
    PoolModule,
    UnstakeModule,
  ],
  controllers: [ClaimController],
  providers: [ClaimService, StakingContract],
  exports: [ClaimService]
})
export class ClaimModule {}
