import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ClaimService } from '../claim.service';
import { Claim } from '../entities/claim.entity';
import { poolStub } from '../../pool/tests/pool.stub';

describe('ClaimService', () => {
  let service: ClaimService;

  const claimDto = {
    wallet: '0xd895c67837bcde8c6df7b0e20c825c849619858d',
    pool: poolStub(),
    amount: 1110.71,
    claimDate: new Date('2022-05-18T13:15:18.000+00:00'),
    hash: '0x5ce46ef7b4f084832f003036f550bf6c5fbcf99d7148bd2e680f2fa02ab1c163',
    unstaked: false
  }
  const mockClaim = {
    _id: '62cc1ada91bcdafd0452ab39',
    ...claimDto
  }

  const mockModel = {
    save: jest.fn().mockResolvedValue(mockClaim),
    findOne: jest.fn().mockResolvedValue(mockClaim),
    find: jest.fn().mockResolvedValue([mockClaim]),
    updateMany: jest.fn(),
    aggregate: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimService,
        {
          provide: getModelToken(Claim.name),
          useValue: mockModel
        }
      ],
    }).compile();

    service = module.get<ClaimService>(ClaimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one', async () => {
    const foundClaim = await service.findOne(mockClaim._id);
    expect(foundClaim).toEqual(mockClaim);
  })

  it('should find all', async () => {
    const claims = await service.findAll();
    expect([mockClaim]).toEqual(claims)
  })

  it('should find all after date', async () => {
    const claims = await service.findAllAfter(new Date());
    expect([mockClaim]).toEqual(claims)
  })

  it('should find by hash', async () => {
    const claim = await service.findByHash(mockClaim.hash)
    expect(claim).toEqual(mockClaim)
  })

  it('should find and set collected true', async () => {
    const claims = await service.findAndCollect(mockClaim.wallet,mockClaim.pool._id)
    console.log(claims)
    expect(claims).toEqual([mockClaim])
  })

  it('should total claimed', async () => {
    const total = await service.totalClaimed();
    expect(total).toEqual(0)
  })
});
