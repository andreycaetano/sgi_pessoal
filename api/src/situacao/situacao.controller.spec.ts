import { Test, TestingModule } from '@nestjs/testing';
import { SituacaoController } from './situacao.controller';
import { SituacaoService } from './situacao.service';

describe('SituacaoController', () => {
  let controller: SituacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SituacaoController],
      providers: [SituacaoService],
    }).compile();

    controller = module.get<SituacaoController>(SituacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
