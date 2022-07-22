import { Test, TestingModule } from '@nestjs/testing';
import { PoolController } from '../pool.controller';
import { PoolService } from '../pool.service';
import { Pool } from '../entities/pool.entity';
import { poolStub } from './pool.stub';
import { CreatePoolDto } from '../dto/create-pool.dto';

jest.mock('../pool.service');

describe('PoolController', () => {
  let controller: PoolController;
  let service: PoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [PoolController],
      providers: [PoolService],
    }).compile();

    controller = module.get<PoolController>(PoolController);
    service = module.get<PoolService>(PoolService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let pools: Pool[];
    beforeEach(async () => {
      pools = await controller.findAll();
    })
    test('should return all pools', async () => {
      expect(pools).toEqual([poolStub()])
    })
  })

  describe('findOne', () => {
    let pool: Pool;
    let stub: Pool;
    beforeEach(async () => {
      stub = poolStub();
      pool = await controller.findOne(stub._id);
    })
    test('should return pool with same id',async () => {
      expect(pool).toEqual(poolStub());
    })
  })

  describe('update', () => {
    let pool: Pool;
    let stub: Pool;
    let poolDto: CreatePoolDto;

    test('should return plan with same id', async () => {
      expect(pool).toEqual(stub);   
    })
  })
});
