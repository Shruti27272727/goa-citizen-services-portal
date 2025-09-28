import { Test, TestingModule } from '@nestjs/testing';
import { OfficersController } from './officers.controller';

describe('OfficersController', () => {
  let controller: OfficersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficersController],
    }).compile();

    controller = module.get<OfficersController>(OfficersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
