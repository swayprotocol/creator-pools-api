import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { planSchema } from './entities/plan.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StakingContract } from '../shared/StakingContract';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Plan', schema: planSchema}]),
  ],
  controllers: [PlanController],
  providers: [PlanService, StakingContract],
  exports: [PlanService]
})
export class PlanModule {}
