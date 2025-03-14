import { Test, TestingModule } from '@nestjs/testing';
import { NivelCargoController } from './nivel-cargo.controller';
import { NivelCargoService } from './nivel-cargo.service';

describe('NivelCargoController', () => {
  let controller: NivelCargoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NivelCargoController],
      providers: [NivelCargoService],
    }).compile();

    controller = module.get<NivelCargoController>(NivelCargoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
