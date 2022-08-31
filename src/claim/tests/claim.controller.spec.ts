import { Test, TestingModule } from '@nestjs/testing';
import { ClaimController } from '../claim.controller';
import { ClaimService } from '../claim.service';
import { Claim } from '../entities/claim.entity';
import { claimStub } from './claim.stub';

describe('ClaimController', () => {
  let controller: ClaimController;

  const mockClaimService = {
    create: jest.fn().mockResolvedValue(claimStub()),
    findAllAfter: jest.fn().mockResolvedValue([claimStub()]),
    findAll: jest.fn().mockResolvedValue([claimStub()]),
    findOne: jest.fn().mockResolvedValue(claimStub()),
    findByHash: jest.fn().mockResolvedValue(claimStub()),
    findAndCollect: jest.fn().mockResolvedValue([claimStub()]),
    totalClaimed: jest.fn().mockResolvedValue(Number)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimController],
      providers: [ClaimService],
    })
    .overrideProvider(ClaimService)
    .useValue(mockClaimService)
    .compile();

    controller = module.get<ClaimController>(ClaimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    let claims: Claim[];

    beforeEach(async () => {
      claims = await controller.findAll();
    })
    test('should return all claims', async () => {
      expect(claims).toEqual([claimStub()])
    })
  })

  describe('findOne', () => {
    let claim: Claim;
    let stub: Claim;

    beforeEach(async () => {
      stub = claimStub();
      claim = await controller.findOne(stub._id)
    })
    test('should return claim with same id', async () => {
      expect(claim).toEqual(stub);
    })
  })

  describe('totalRewards', () => {
    let totalRewards: number
    beforeEach(async () => {
      totalRewards = await controller.getTotalRewards();
    })
    test('should return all claims total reward', async () => {
      expect(totalRewards).toEqual(Number)
    })
  })
});
