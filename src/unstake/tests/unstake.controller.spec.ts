import { Test, TestingModule } from '@nestjs/testing';
import { UnstakeController } from '../unstake.controller';
import { UnstakeService } from '../unstake.service';

jest.mock('../unstake.service');

describe('UnstakeController', () => {
  let controller: UnstakeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UnstakeController],
      providers: [UnstakeService],
    }).compile();

    controller = module.get<UnstakeController>(UnstakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
