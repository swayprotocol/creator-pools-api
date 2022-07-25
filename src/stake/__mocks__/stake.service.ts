import { stakeStub } from '../tests/stake.stub';
import { topStakedPoolStub } from '../tests/stake.stub';
import { activeStakesPoolStub } from '../tests/stake.stub';
import { distributionStub } from '../tests/stake.stub';

export const StakeService = jest.fn().mockResolvedValue({
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
})