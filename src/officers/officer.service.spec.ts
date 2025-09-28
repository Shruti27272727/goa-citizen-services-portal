import { Test, TestingModule } from '@nestjs/testing';
import { OfficersService } from './officer.service';

describe('OfficersService', () => {
  let service: OfficersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficersService],
    }).compile();

    service = module.get<OfficersService>(OfficersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
