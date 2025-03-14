import { Test, TestingModule } from '@nestjs/testing';
import { TipoPcdService } from './tipo-pcd.service';

describe('TipoPcdService', () => {
  let service: TipoPcdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoPcdService],
    }).compile();

    service = module.get<TipoPcdService>(TipoPcdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
