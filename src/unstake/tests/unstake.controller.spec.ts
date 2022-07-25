import { Test, TestingModule } from '@nestjs/testing';
import { Unstake } from '../entities/unstake.entity';
import { UnstakeController } from '../unstake.controller';
import { UnstakeService } from '../unstake.service';
import { unstakeStub } from './unstake.stub';

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

  describe('findOne', () => {
    let unstake: Unstake;
    beforeEach(async () => {
      unstake = await controller.findOne('62cc1ada91bcdafd0452ace3')
    })
    test('should return unstak', async () => {
      expect(unstake).toEqual(unstakeStub())
    })
  })

  describe('findAll', () => {
    let unstake: Unstake[];
    beforeEach(async () => {
      unstake = await controller.findAll()
    })
    test('should return all unstakes', async () => {
      expect(unstake).toEqual([unstakeStub()])
    })
  })
});
