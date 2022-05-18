import { planStub } from "../tests/plan.stub";

export const PlanService = jest.fn().mockResolvedValue({
  create: jest.fn().mockResolvedValue(planStub()),
  findAll:jest.fn().mockResolvedValue([planStub()]),
  findOne: jest.fn().mockResolvedValue(planStub()),
  update: jest.fn().mockResolvedValue(planStub()),
  remove: jest.fn().mockResolvedValue(planStub())
})