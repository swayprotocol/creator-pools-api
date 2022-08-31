import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClaimModule } from './claim/claim.module';
import { MONGO_URL, MORALIS_URL } from './config';
import { PlanModule } from './plan/plan.module';
import { PoolModule } from './pool/pool.module';
import { StakingContract } from './shared/StakingContract';
import { StakeModule } from './stake/stake.module';
import { UnstakeModule } from './unstake/unstake.module';
import { MoralisClaimModule } from './_moralis/claim/claim.module';
import { MoralisPoolModule } from './_moralis/pool/pool.module';
import { MoralisStakeModule } from './_moralis/stake/stake.module';
import { MoralisUnstakeModule } from './_moralis/unstake/unstake.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(MONGO_URL, {connectionName: 'ourDb'}), 
        MongooseModule.forRoot(MORALIS_URL, {connectionName: 'moralisDb'}),
        PlanModule, 
        PoolModule, 
        StakeModule, 
        ClaimModule, 
        UnstakeModule, 
        MoralisPoolModule,
        MoralisStakeModule,
        MoralisClaimModule,
        MoralisUnstakeModule
      ],
      controllers: [AppController],
      providers: [AppService, StakingContract],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Health', () => {
    it('should return current date', () => {
      const result = appController.getHealth()
      expect(result?.message).toBe('Ok');
    });
  });
});
