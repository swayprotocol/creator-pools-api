import { Test, TestingModule } from '@nestjs/testing';
import { ClaimController } from '../claim.controller';
import { ClaimService } from '../claim.service';

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
});
