import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlanDto } from '../dto/create-plan.dto';
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

  describe('create', () => {
    let stub: Plan;
    let planDto: CreatePlanDto;
    let plan: Plan;

    beforeEach(async () => {
      stub = planStub();
      planDto = {
        apy: stub.apy,
        availableUntil: stub.availableUntil,
        lockMonths: stub.lockMonths,
      }
      plan = await controller.create(planDto);
    })
    test('should return a plan', () => {
      expect(plan).toEqual(stub);
    })
  })

  describe('findAll', () => {
    let plans: Plan[];

    beforeEach(async () => {
      plans= await controller.findAll();
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
      plan= await controller.findOne(stub._id);
    })
    test('should return plan with same id', async () => {
      expect(plan).toEqual(planStub());   
    })
  })

  describe('update', () => {
    let plan: Plan;
    let stub: Plan;
    let planDto: CreatePlanDto;

    beforeEach(async () => {
      stub = planStub();
      planDto = {
        apy: stub.apy,
        availableUntil: stub.availableUntil,
        lockMonths: stub.lockMonths,
      }
      
      plan= await controller.update(stub._id,planDto);
    })
    test('should return plan with same id', async () => {
      expect(plan).toEqual(stub);   
    })
  })

  describe('remove', () => {
    let plan: Plan;
    let stub: Plan;
    beforeEach(async () => {
      stub = planStub();
      plan= await controller.remove(stub._id);
    })
    test('should return plan with same id', async () => {
      expect(plan).toEqual(planStub());   
    })
  })
});

