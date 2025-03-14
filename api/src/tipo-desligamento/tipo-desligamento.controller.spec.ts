import { Test, TestingModule } from '@nestjs/testing';
import { TipoDesligamentoController } from './tipo-desligamento.controller';
import { TipoDesligamentoService } from './tipo-desligamento.service';

describe('TipoDesligamentoController', () => {
  let controller: TipoDesligamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoDesligamentoController],
      providers: [TipoDesligamentoService],
    }).compile();

    controller = module.get<TipoDesligamentoController>(
      TipoDesligamentoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
