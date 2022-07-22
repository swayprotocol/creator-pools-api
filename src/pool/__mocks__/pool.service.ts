import { poolStub } from "../tests/pool.stub";

export const PoolService = jest.fn().mockResolvedValue({
  create: jest.fn().mockResolvedValue(poolStub()),
  findAllAfter: jest.fn().mockResolvedValue([poolStub()]),
  findAll: jest.fn().mockResolvedValue([poolStub()]),
  findOne: jest.fn().mockResolvedValue(poolStub()),
  findByHash: jest.fn().mockResolvedValue(poolStub()),
  findOneByHandle: jest.fn().mockResolvedValue(poolStub()),
  updateByHandle: jest.fn().mockResolvedValue(poolStub()),
})