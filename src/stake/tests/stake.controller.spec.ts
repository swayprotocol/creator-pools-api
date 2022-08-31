
import { Test, TestingModule } from '@nestjs/testing';
import { StakeController } from '../stake.controller';
import { StakeService } from '../stake.service';
import { Stake } from '../entities/stake.entity';
import { activeStakesPoolStub, distributionStub, stakeStub, topStakedPoolStub } from './stake.stub';
import { TopStakedPools } from '../dto/topStakedPools.dto';

jest.mock('../stake.service');

describe('StakeController', () => {
  let controller: StakeController;

  const mockStakeService = {
    create: jest.fn().mockResolvedValue(stakeStub()),
    findAllAfter: jest.fn().mockResolvedValue([stakeStub()]),
    findAll: jest.fn().mockResolvedValue([stakeStub()]),
    findOne: jest.fn().mockResolvedValue(stakeStub()),
    findByHash: jest.fn().mockResolvedValue(stakeStub()),
    findUncollected: jest.fn().mockResolvedValue([stakeStub()]),
    findStakedUntil: jest.fn().mockResolvedValue(stakeStub()),
    claimedStakedAt: jest.fn().mockRejectedValue([stakeStub()]),
    collect: jest.fn(),
    channelDistribution: jest.fn().mockResolvedValue(distributionStub()),
    activeStakes: jest.fn().mockResolvedValue([stakeStub()]),
    activeStakesPools: jest.fn().mockResolvedValue([activeStakesPoolStub()]),
    activeStakesPool: jest.fn().mockResolvedValue(activeStakesPoolStub()),
    topCreatorPools: jest.fn().mockResolvedValue([topStakedPoolStub()]),
    latestStakes: jest.fn().mockResolvedValue([stakeStub()]),
    highestPositions: jest.fn().mockResolvedValue([stakeStub()]),
    totalCurrentlyStaked: jest.fn().mockResolvedValue(Number),
    totalStaked: jest.fn().mockResolvedValue(Number),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StakeController],
      providers: [StakeService],
    })
    .overrideProvider(StakeService)
    .useValue(mockStakeService)
    .compile();

    controller = module.get<StakeController>(StakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    let stakes: Stake[];
    beforeEach(async () => {
      stakes = await controller.findAll()
    })
    test('should return all stakes', async () => {
      expect(stakes).toEqual([stakeStub()])
    })
  })

  describe('topStakedPools', () => {
    let stakes: TopStakedPools[];
    beforeEach(async () => {
      stakes = await controller.topStakedPools()
    })
    test('should return top staked pools', async () => {
      expect(stakes).toEqual([topStakedPoolStub()])
    })
  })

  describe('latestStakes', () => {
    let stakes: Stake[];
    beforeEach(async () => {
      stakes = await controller.latestStakes()
    })
    test('should return stakes ordered by date', async () => {
      expect(stakes).toEqual([stakeStub()])
    })
  })

  describe('highestPositions', () => {
    let stakes: Stake[];
    beforeEach(async () => {
      stakes = await controller.highestPositions()
    })
    test('should return stakes highest position', async () => {
      expect(stakes).toEqual([stakeStub()])
    })
  })

  describe('totalCurrentlyStaked', () => {
    let currentlyStaked;
    beforeEach(async () => {
      currentlyStaked = await controller.getTotalCurrentlyStaked()
    })
    test('should return currently staked amount', async () => {
      expect(currentlyStaked).toEqual(Number)
    })
  })

  describe('totalStaked', () => {
    let currentlyStaked;
    beforeEach(async () => {
      currentlyStaked = await controller.getTotalStaked()
    })
    test('should return total staked amount', async () => {
      expect(currentlyStaked).toEqual(Number)
    })
  })

  describe('channelDistribution', () => {
    let channelDistribution;
    beforeEach(async () => {
      channelDistribution = await controller.getchannelDistribution()
    })
    test('should return channel distribution data', async () => {
      expect(channelDistribution).toEqual(distributionStub())
    })
  })

  describe('getActiveStakesPool', () => {
    let activeStakesPool;
    beforeEach(async () => {
      activeStakesPool = await controller.getActiveStakesPool('ig-banksy','0x606153fed24d005fcfbe3983f643a343516cd0e4');
    })
    test('should return active stakes in pool', async () => {
      expect(activeStakesPool).toEqual(activeStakesPoolStub())
    })
  })

  describe('activeStakesWallet', () => {
    let activeStakesWallet;
    beforeEach(async () => {
      activeStakesWallet = await controller.getActiveStakesWallet('0x606153fed24d005fcfbe3983f643a343516cd0e4');
    })
    test('should return active stakes by wallet', async () => {
      expect(activeStakesWallet).toEqual([activeStakesPoolStub()])
    })
  })

  describe('findOne', () => {
    let stake: Stake;
    beforeEach(async () => {
      stake = await controller.findOne('62cc1a0091bcdafd0452a8e9');
    })
    test('should return stake by id', async () => {
      expect(stake).toEqual(stakeStub())
    })
  })

  describe('allActiveStakes',() => {
    let stakes: Stake[];
    beforeEach(async () => {
      stakes = await controller.getActiveStakes('0x606153fed24d005fcfbe3983f643a343516cd0e4')
    })
    test('should return active stakes by wallet', async () => {
      expect(stakes).toEqual([stakeStub()])
    })
  })
});
