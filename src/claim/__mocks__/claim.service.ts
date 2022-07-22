import { claimStub } from '../tests/claim.stub';

export const ClaimService = jest.fn().mockResolvedValue({
  create: jest.fn().mockResolvedValue(claimStub()),
  findAllAfter: jest.fn().mockResolvedValue([claimStub()]),
  findAll: jest.fn().mockResolvedValue([claimStub()]),
  findOne: jest.fn().mockResolvedValue(claimStub()),
  findByHash: jest.fn().mockResolvedValue(claimStub()),
  findAndCollect: jest.fn().mockResolvedValue([claimStub()]),
  totalClaimed: jest.fn().mockResolvedValue(Number)
})