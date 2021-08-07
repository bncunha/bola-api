import { Test, TestingModule } from '@nestjs/testing';
import { PartidasJobService } from './partidas-job.service';

describe('PartidasJobService', () => {
  let service: PartidasJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartidasJobService],
    }).compile();

    service = module.get<PartidasJobService>(PartidasJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
