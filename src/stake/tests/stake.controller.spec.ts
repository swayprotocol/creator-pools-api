import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { StakeController } from '../stake.controller';
import { StakeService } from '../stake.service';
import { PoolModule } from '../../pool/pool.module';
import { PlanModule } from '../../plan/plan.module';
import { aggregatedPoolSchema } from '../../pool/entities/aggregatedPool.schema';
import { stakeSchema } from '../entities/stake.schema';

jest.mock('../stake.service');

describe('StakeController', () => {
  let controller: StakeController;
  let service: StakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [StakeController],
      providers: [StakeService],
    }).compile();

    controller = module.get<StakeController>(StakeController);
    service = module.get<StakeService>(StakeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
