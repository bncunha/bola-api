import { Test, TestingModule } from '@nestjs/testing';
import { BoloesService } from './boloes.service';

describe('BoloesService', () => {
  let service: BoloesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoloesService],
    }).compile();

    service = module.get<BoloesService>(BoloesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
