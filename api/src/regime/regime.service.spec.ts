import { Test, TestingModule } from '@nestjs/testing';
import { RegimeService } from './regime.service';

describe('RegimeService', () => {
  let service: RegimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegimeService],
    }).compile();

    service = module.get<RegimeService>(RegimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
