import { planStub } from "../tests/plan.stub";

export const PlanService = jest.fn().mockResolvedValue({
  create: jest.fn().mockResolvedValue(planStub()),
  findAll: jest.fn().mockResolvedValue([planStub()]),
  findOne: jest.fn().mockResolvedValue(planStub()),
  findOneByBlockchainIndex: jest.fn().mockResolvedValue(planStub()),
  remove: jest.fn().mockResolvedValue(planStub()),
  getPlansBC: jest.fn().mockRejectedValue([planStub()]),
  getActive: jest.fn().mockResolvedValue([planStub()]),
  getMaxApy: jest.fn().mockResolvedValue(planStub()),
  getAverageApy: jest.fn().mockResolvedValue(Number),
})