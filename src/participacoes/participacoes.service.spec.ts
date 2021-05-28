import { Test, TestingModule } from '@nestjs/testing';
import { ParticipacoesService } from './participacoes.service';

describe('ParticipacoesService', () => {
  let service: ParticipacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipacoesService],
    }).compile();

    service = module.get<ParticipacoesService>(ParticipacoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
