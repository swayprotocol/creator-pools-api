import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGO_URL } from './config';
import { PlanModule } from './plan/plan.module';
import { PoolModule } from './pool/pool.module';
import { StakeModule } from './stake/stake.module';
import { ClaimModule } from './claim/claim.module';
import { UnstakeModule } from './unstake/unstake.module';
import { StakingContract } from './shared/StakingContract';

const database = MongooseModule.forRoot(MONGO_URL);

@Module({
  imports: [database, PlanModule, PoolModule, StakeModule, ClaimModule, UnstakeModule],
  controllers: [AppController],
  providers: [AppService, StakingContract],
})
export class AppModule {}
