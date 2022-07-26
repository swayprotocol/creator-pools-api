import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from '../entities/pool.entity';
import { PoolService } from '../pool.service';

describe('PoolService', () => {
  let service: PoolService;

  const poolDto = {
    creator: 'ig-banksy',
    startTime: new Date('2022-07-04T09:44:05.000+00:00'),
    hash: '0x9610dff4b9e0cf8649253714b20a993542088c6c59ef88d9a3746afb93260843'
  }

  const mockPool = {
    _id: '62cc19fe91bcdafd0452a8df',
    ...poolDto
  }

  const mockModel = {
    findOne: jest.fn().mockResolvedValue(mockPool),
    find: jest.fn().mockResolvedValue([mockPool]),
    findOneAndUpdate: jest.fn().mockResolvedValue(mockPool),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoolService,
        {
          provide: getModelToken(Pool.name),
          useValue: mockModel,
        }
      ]
    }).compile();

    service = module.get<PoolService>(PoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all after date', async () => {
    const pools = await service.findAllAfter(new Date());
    expect(pools).toEqual([mockPool])
  })

  it('should find all', async () => {
    const pools = await service.findAll();
    expect(pools).toEqual([mockPool])
  })

  it('should find one', async () => {
    const pool = await service.findOne(mockPool._id)
    expect(pool).toEqual(mockPool)
  })
  
  it('should find by hash', async () => {
    const pool = await service.findByHash(mockPool.hash)
    expect(pool).toEqual(mockPool)
  })

  it('should find one by handle', async () => {
    const pool = await service.findOneByHandle(mockPool.creator)
    expect(pool).toEqual(mockPool)
  })
  
  it('should update by handle', async () => {
    const pool = await service.findOneByHandle(mockPool.creator)
    expect(pool).toEqual(mockPool)
  })
});
