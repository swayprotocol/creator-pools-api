import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from '../plan.service';
import { Plan } from '../entities/plan.entity'
import { StakingContract } from '../../shared/StakingContract';

describe('PlanService', () => {
  let service: PlanService;

  const planDto = {
    blockchainIndex: 7,
    apy: 111,
    availableUntil: new Date('2022-12-31T23:00:00.000+00:00'),
    lockMonths: 6,
    createdAt: new Date('2022-05-26T09:04:02.739+00:00')
  }

  const mockPlan = {
    _id: '62c44f59e87c6e62c6370d92',
    ...planDto
  }

  const mockModel = {
    save: jest.fn().mockResolvedValue(mockPlan),
    find: jest.fn().mockResolvedValue([mockPlan]),
    findOne: jest.fn().mockResolvedValue(mockPlan),
    findOneAndRemove:jest.fn().mockResolvedValue(mockPlan),
    sort: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        {
          provide: getModelToken(Plan.name),
          useValue: mockModel
        },
        StakingContract
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all', async () => {
    const plans = await service.findAll()
    expect(plans).toEqual([mockPlan])
  })

  it('should find one by id', async () => {
    const plan = await service.findOne(mockPlan._id)
    expect(plan).toEqual(mockPlan)
  })

  it('should find one by blockchain index', async () => {
    const plan = await service.findOneByBlockchainIndex(mockPlan.blockchainIndex)
    expect(plan).toEqual(mockPlan)
  })

  it('should remove', async () => {
    const plan = await service.remove(mockPlan._id)
    expect(plan).toEqual(mockPlan)
  })

  it('should get active', async () => {
    const plan = await service.getActive()
    expect(plan).toEqual([mockPlan])
  })

  it('should get average apy', async () => {
    const apy = await service.getAverageApy()
    expect(apy).toEqual(111)
  })

});
