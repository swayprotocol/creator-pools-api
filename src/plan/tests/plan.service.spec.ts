import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from '../plan.service';

jest.mock('../plan.service');

describe('PlanService', () => {
  let service: PlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanService],
    }).compile();

    service = module.get<PlanService>(PlanService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
