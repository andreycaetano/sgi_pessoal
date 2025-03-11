import { Test, TestingModule } from '@nestjs/testing';
import { OrientacaoSexualService } from './orientacao-sexual.service';

describe('OrientacaoSexualService', () => {
  let service: OrientacaoSexualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrientacaoSexualService],
    }).compile();

    service = module.get<OrientacaoSexualService>(OrientacaoSexualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
