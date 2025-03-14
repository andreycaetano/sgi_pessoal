import { Test, TestingModule } from '@nestjs/testing';
import { SituacaoService } from './situacao.service';

describe('SituacaoService', () => {
  let service: SituacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SituacaoService],
    }).compile();

    service = module.get<SituacaoService>(SituacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
