import { Test, TestingModule } from '@nestjs/testing';
import { RegimeController } from './regime.controller';
import { RegimeService } from './regime.service';

describe('RegimeController', () => {
  let controller: RegimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegimeController],
      providers: [RegimeService],
    }).compile();

    controller = module.get<RegimeController>(RegimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
