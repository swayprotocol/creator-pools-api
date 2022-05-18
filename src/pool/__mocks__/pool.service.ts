import { poolStub } from "../tests/pool.stub";

export const PoolService = jest.fn().mockResolvedValue({
  create: jest.fn().mockResolvedValue(poolStub()),
  findAll: jest.fn().mockResolvedValue([poolStub()]),
  findOne: jest.fn().mockResolvedValue(poolStub()),
  update: jest.fn().mockResolvedValue(poolStub()),
  remove: jest.fn().mockResolvedValue(poolStub())
})