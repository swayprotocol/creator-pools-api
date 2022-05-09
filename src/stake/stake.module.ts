import { Module } from '@nestjs/common';
import { StakeService } from './stake.service';
import { StakeController } from './stake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { stakeSchema } from './entities/stake.schema';
import { StakingContract } from '../shared/StakingContract';
import { PoolModule } from '../pool/pool.module';
import { PlanModule } from '../plan/plan.module';
import { ClaimModule } from '../claim/claim.module';
import { UnstakeModule } from '../unstake/unstake.module';
import { aggregatedPoolSchema } from '../pool/entities/aggregatedPool.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Stake', schema: stakeSchema}]),
    MongooseModule.forFeature([{name: 'AggregatedPool', schema: aggregatedPoolSchema}]),
    PoolModule,
    PlanModule,
    ClaimModule,
    UnstakeModule
  ],
  controllers: [StakeController],
  providers: [StakeService,  StakingContract]
})
export class StakeModule {}
