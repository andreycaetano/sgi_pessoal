import { Test, TestingModule } from '@nestjs/testing';
import { TipoPcdController } from './tipo-pcd.controller';
import { TipoPcdService } from './tipo-pcd.service';

describe('TipoPcdController', () => {
  let controller: TipoPcdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoPcdController],
      providers: [TipoPcdService],
    }).compile();

    controller = module.get<TipoPcdController>(TipoPcdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
