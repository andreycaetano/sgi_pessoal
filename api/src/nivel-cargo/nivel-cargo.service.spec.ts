import { Test, TestingModule } from '@nestjs/testing';
import { NivelCargoService } from './nivel-cargo.service';

describe('NivelCargoService', () => {
  let service: NivelCargoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NivelCargoService],
    }).compile();

    service = module.get<NivelCargoService>(NivelCargoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
