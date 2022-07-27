import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from '../../plan/plan.service';
import { PoolService } from '../../pool/pool.service';
import { StakeService } from '../stake.service';
import { Stake } from '../entities/stake.entity';
import { planStub } from '../../plan/tests/plan.stub';
import { poolStub } from '../../pool/tests/pool.stub';

describe('StakeService', () => {
  let service: StakeService;

  const stakeDto = {
    plan: planStub(),
    pool: poolStub(),
    stakedAt: new Date('2022-07-04T09:44:05.000+00:00'),
    stakedUntil: new Date('2022-12-31T09:44:05.000+00:00'),
    amount: 1000,
    wallet: '0x606153fed24d005fcfbe3983f643a343516cd0e4',
    collected: false,
    hash: '0x9610dff4b9e0cf8649253714b20a993542088c6c59ef88d9a3746afb93260843'
  }

  const mockStake = {
    _id: '62cc1a0091bcdafd0452a8e9',
    ...stakeDto
  }

  let mockModal = {
    save: jest.fn().mockResolvedValue(mockStake),
    find: jest.fn().mockResolvedValue([mockStake]),
    findOne: jest.fn().mockResolvedValue(mockStake),
    aggregate: jest.fn(),
    updateMany: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StakeService,
        {
          provide: getModelToken(Stake.name),
          useValue: mockModal
        },
        {
          provide: getModelToken('AggregatedPool'),
          useValue: {}
        },
        {
          provide: PlanService,
          useValue: {
            getAverageApy: jest.fn()
          }
        },
        {
          provide: PoolService,
          useValue: {
            findOneByHandle: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<StakeService>(StakeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all after date', async () => {
    const stakes = await service.findAllAfter(new Date())
    expect(stakes).toEqual([mockStake])
  })

  it('should find all', async () => {
    const stakes = await service.findAll()
    expect(stakes).toEqual([mockStake])
  })

  it('should find one by id', async () => {
    const stake = await service.findOne(mockStake._id)
    expect(stake).toEqual(mockStake)
  })

  it('should find one by hash', async () => {
    const stake = await service.findByHash(mockStake.hash)
    expect(stake).toEqual(mockStake)
  })

  it('should all find uncollected', async () => {
    const stakes = await service.findUncollected(mockStake.wallet, mockStake.pool)
    expect(stakes).toEqual([mockStake])
  })

  it('should find staked until', async () => {
    const stakes = await service.findStakedUntil(mockStake.wallet, mockStake.pool)
    expect(stakes).toEqual([mockStake])
  })

  it('should claim stakes staked at date', async () => {
    await service.claimedStakedAt(mockStake.wallet,mockStake.pool, new Date())
    expect(mockModal.updateMany).toHaveBeenCalled()
  })

  it('should get total currently staked', async () => {
    const staked = await service.totalCurrentlyStaked()
    expect(staked).toEqual(0)
  })

  it('should get total staked', async () => {
    const staked = await service.totalStaked()
    expect(staked).toEqual(0)
  })

});
