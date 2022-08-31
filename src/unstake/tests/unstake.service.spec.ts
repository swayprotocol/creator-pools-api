import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { poolStub } from '../../pool/tests/pool.stub';
import { Unstake } from '../entities/unstake.entity';
import { UnstakeService } from '../unstake.service';

describe('UnstakeService', () => {
  let service: UnstakeService;

  const unstakeDto = {
    wallet: '0x079f4b4cdc3de2d74588c828ce900d38fd905015',
    hash: '0x374db9ed7e9472f968f0563dd06a358d8e419c3dc0f670de0b6265370e77f319',
    unstakeDate: new Date('2022-05-18T09:58:48.000+00:00'),
    pool: poolStub(),
    amount: 1000
  }

  const mockUnstake = {
    _id: '',
    ...unstakeDto
  }

  const mockModel = {
    findOne: jest.fn().mockResolvedValue(mockUnstake),
    find: jest.fn().mockResolvedValue([mockUnstake]),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnstakeService,
        {
          provide: getModelToken(Unstake.name),
          useValue: mockModel
        }
      ],
    }).compile();

    service = module.get<UnstakeService>(UnstakeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all after date', async () => {
    const unstakes = await service.findAllAfter(new Date())
    expect(unstakes).toEqual([mockUnstake])
  })

  it('should find all', async () => {
    const unstakes = await service.findAll()
    expect(unstakes).toEqual([mockUnstake])
  })

  it('should find one', async () => {
    const unstake = await service.findOne(mockUnstake._id)
    expect(unstake).toEqual(mockUnstake)
  })

  it('should one by hash', async () => {
    const unstake = await service.findByHash(mockUnstake.hash)
    expect(unstake).toEqual(mockUnstake)
  })
});
