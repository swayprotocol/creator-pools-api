import { Test, TestingModule } from '@nestjs/testing';
import { Plan } from '../entities/plan.entity';
import { PlanController } from '../plan.controller';
import { PlanService } from '../plan.service';
import { planStub } from './plan.stub';

describe('PlanController', () => {
  let controller: PlanController;

  const mockPlanService = {
    create: jest.fn().mockResolvedValue(planStub()),
    findAll: jest.fn().mockResolvedValue([planStub()]),
    findOne: jest.fn().mockResolvedValue(planStub()),
    findOneByBlockchainIndex: jest.fn().mockResolvedValue(planStub()),
    remove: jest.fn().mockResolvedValue(planStub()),
    getPlansBC: jest.fn().mockRejectedValue([planStub()]),
    getActive: jest.fn().mockResolvedValue([planStub()]),
    getMaxApy: jest.fn().mockResolvedValue(planStub()),
    getAverageApy: jest.fn().mockResolvedValue(Number),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanController],
      providers: [PlanService],
    })
    .overrideProvider(PlanService)
    .useValue(mockPlanService)
    .compile();

    controller = module.get<PlanController>(PlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    let plans: Plan[];

    beforeEach(async () => {
      plans = await controller.findAll();
    })
    test('should return all plans', async () => {
      expect(plans).toEqual([planStub()]);   
    })
  })

  describe('findOne', () => {
    let plan: Plan;
    let stub: Plan;

    beforeEach(async () => {
      stub = planStub();
      plan = await controller.findOne(stub._id);
    })

    test('should return plan with same id', async () => {
      expect(plan).toEqual(planStub());   
    })
  })

  describe('active', () => {
    let plans: Plan[];

    beforeEach(async () => {
      plans = await controller.getActive();
    })

    test('should return all active plans', async () => {
      expect(plans).toEqual([planStub()]);   
    })
  })

  
  describe('maxApy', ()=> {
    let plan: Plan;
    let stub: Plan;
    beforeEach(async () => {
      stub = planStub();
      plan = await controller.getMaxApy();
    })
    test('should return plan apy', async () => {
      expect(plan.apy).toEqual(stub.apy);   
    })
  })
});