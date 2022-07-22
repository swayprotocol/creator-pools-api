import { Test, TestingModule } from '@nestjs/testing';
import { Plan } from '../entities/plan.entity';
import { PlanController } from '../plan.controller';
import { PlanService } from '../plan.service';
import { planStub } from './plan.stub';

jest.mock('../plan.service');

describe('PlanController', () => {
  let controller: PlanController;
  let service: PlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [PlanController],
      providers: [PlanService],
    }).compile();

    controller = module.get<PlanController>(PlanController);
    service = module.get<PlanService>(PlanService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
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