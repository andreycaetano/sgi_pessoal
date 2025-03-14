import { Test, TestingModule } from '@nestjs/testing';
import { OrientacaoSexualController } from './orientacao-sexual.controller';
import { OrientacaoSexualService } from './orientacao-sexual.service';

describe('OrientacaoSexualController', () => {
  let controller: OrientacaoSexualController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrientacaoSexualController],
      providers: [OrientacaoSexualService],
    }).compile();

    controller = module.get<OrientacaoSexualController>(
      OrientacaoSexualController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
