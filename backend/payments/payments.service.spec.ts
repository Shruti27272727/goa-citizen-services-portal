import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Application } from '../application/application.entity';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockPaymentRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  let mockAppRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepo,
        },
        {
          provide: getRepositoryToken(Application),
          useValue: mockAppRepo,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment for an application', async () => {
    const fakeApplication = { id: 1, service: { fee: 100 } };
    mockAppRepo.findOne.mockResolvedValue(fakeApplication);
    mockPaymentRepo.create.mockReturnValue({}); 
    mockPaymentRepo.save.mockResolvedValue({});

    const result = await service.createPayment(1);
    expect(mockAppRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['service'],
    });
    expect(mockPaymentRepo.create).toHaveBeenCalled();
  });
});
