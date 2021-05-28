import { Test, TestingModule } from '@nestjs/testing';
import { PalpitesService } from './palpites.service';

describe('PalpitesService', () => {
  let service: PalpitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PalpitesService],
    }).compile();

    service = module.get<PalpitesService>(PalpitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
