import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGO_URL, MORALIS_URL } from './config';
import { PlanModule } from './plan/plan.module';
import { PoolModule } from './pool/pool.module';
import { StakeModule } from './stake/stake.module';
import { ClaimModule } from './claim/claim.module';
import { UnstakeModule } from './unstake/unstake.module';
import { StakingContract } from './shared/StakingContract';
import { MoralisPoolModule } from './_moralis/pool/pool.module';
import { MoralisStakeModule } from './_moralis/stake/stake.module';
import { MoralisClaimModule } from './_moralis/claim/claim.module';

const ourDB = MongooseModule.forRoot(MONGO_URL, {connectionName: 'ourDb'});
const moralisDB = MongooseModule.forRoot(MORALIS_URL, {connectionName: 'moralisDb'});

@Module({
  imports: [
    ourDB, 
    moralisDB, 
    PlanModule, 
    PoolModule, 
    StakeModule, 
    ClaimModule, 
    UnstakeModule, 
    MoralisPoolModule,
    MoralisStakeModule,
    MoralisClaimModule,
  ],
  controllers: [AppController],
  providers: [AppService, StakingContract],
})
export class AppModule {}
