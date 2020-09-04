import { Test, TestingModule } from '@nestjs/testing';
import { PerchwellService } from './perchwell.service';

describe('PerchwellService', () => {
  let service: PerchwellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerchwellService],
    }).compile();

    service = module.get<PerchwellService>(PerchwellService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
