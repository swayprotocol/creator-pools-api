import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { planSchema } from './entities/plan.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Plan', schema: planSchema}])],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
