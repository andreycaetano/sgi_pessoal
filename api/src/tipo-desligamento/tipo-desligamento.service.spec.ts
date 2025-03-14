import { Test, TestingModule } from '@nestjs/testing';
import { TipoDesligamentoService } from './tipo-desligamento.service';

describe('TipoDesligamentoService', () => {
  let service: TipoDesligamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoDesligamentoService],
    }).compile();

    service = module.get<TipoDesligamentoService>(TipoDesligamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
