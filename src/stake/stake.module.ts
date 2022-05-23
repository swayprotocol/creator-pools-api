import { Module } from '@nestjs/common';
import { StakeService } from './stake.service';
import { StakeController } from './stake.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { stakeSchema } from './entities/stake.schema';
import { PlanModule } from '../plan/plan.module';
import { aggregatedPoolSchema } from '../pool/entities/aggregatedPool.schema';
import { StakingContract } from '../shared/StakingContract';
import { PoolModule } from 'src/pool/pool.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Stake', schema: stakeSchema}],'ourDb'),
    MongooseModule.forFeature([{name: 'AggregatedPool', schema: aggregatedPoolSchema}],'ourDb'),
    PlanModule,
    PoolModule,
  ],
  controllers: [StakeController],
  providers: [StakeService, StakingContract],
  exports: [StakeService],
})
export class StakeModule {}
