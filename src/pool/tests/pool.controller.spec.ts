import { Test, TestingModule } from '@nestjs/testing';
import { PoolController } from '../pool.controller';
import { PoolService } from '../pool.service';
import { Pool } from '../entities/pool.entity';
import { poolStub } from './pool.stub';

describe('PoolController', () => {
  let controller: PoolController;

  const mockPoolService = {
    create: jest.fn().mockResolvedValue(poolStub()),
    findAllAfter: jest.fn().mockResolvedValue([poolStub()]),
    findAll: jest.fn().mockResolvedValue([poolStub()]),
    findOne: jest.fn().mockResolvedValue(poolStub()),
    findByHash: jest.fn().mockResolvedValue(poolStub()),
    findOneByHandle: jest.fn().mockResolvedValue(poolStub()),
    updateByHandle: jest.fn().mockResolvedValue(poolStub()),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolController],
      providers: [PoolService],
    })
    .overrideProvider(PoolService)
    .useValue(mockPoolService)
    .compile();

    controller = module.get<PoolController>(PoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
});
