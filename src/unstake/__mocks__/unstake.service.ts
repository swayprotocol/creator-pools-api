import { unstakeStub } from "../tests/unstake.stub";

export const UnstakeService = jest.fn().mockResolvedValue({
  findAll: jest.fn().mockResolvedValue([unstakeStub()]),
  findOne: jest.fn().mockResolvedValue(unstakeStub()),
})