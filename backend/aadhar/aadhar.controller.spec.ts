import { Test, TestingModule } from '@nestjs/testing';
import { AadharController } from './aadhar.controller';

describe('AadharController', () => {
  let controller: AadharController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AadharController],
    }).compile();

    controller = module.get<AadharController>(AadharController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
