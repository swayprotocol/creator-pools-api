import { Test, TestingModule } from '@nestjs/testing';
import { ClaimController } from '../claim.controller';
import { ClaimService } from '../claim.service';
import { Claim } from '../entities/claim.entity';
import { claimStub } from './claim.stub';

jest.mock('../claim.service');

describe('ClaimController', () => {
  let controller: ClaimController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ClaimController],
      providers: [ClaimService],
    }).compile();

    controller = module.get<ClaimController>(ClaimController);
    jest.clearAllMocks();
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
